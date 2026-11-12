import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

// Nitro's node-server preset does not compress responses, so a 650KB client bundle
// was reaching browsers uncompressed. Brotli/gzip here keeps transfer sizes at
// roughly a quarter without touching the build pipeline.
const COMPRESSIBLE_CONTENT = /^(?:text\/|application\/(?:json|javascript|xml|manifest\+json|ld\+json)|image\/svg\+xml)/i;
const MIN_COMPRESS_BYTES = 1024;

function appendVary(existing: string | null, value: string): string {
  if (!existing) return value;
  const parts = existing.split(",").map((part) => part.trim().toLowerCase());
  return parts.includes(value) ? existing : `${existing}, ${value}`;
}

async function compressResponse(request: Request, response: Response): Promise<Response> {
  if (request.method === "HEAD") return response;
  if (response.status === 204 || response.status === 304) return response;
  if (response.headers.has("content-encoding")) return response;

  const contentType = response.headers.get("content-type") ?? "";
  if (!COMPRESSIBLE_CONTENT.test(contentType)) return response;

  const declaredLength = Number(response.headers.get("content-length") ?? "0");
  if (declaredLength > 0 && declaredLength < MIN_COMPRESS_BYTES) return response;
  if (!response.body) return response;

  const acceptEncoding = request.headers.get("accept-encoding") ?? "";
  if (!/\bgzip\b/.test(acceptEncoding)) return response;

  const headers = new Headers(response.headers);
  headers.set("content-encoding", "gzip");
  headers.set("vary", appendVary(headers.get("vary"), "accept-encoding"));
  headers.delete("content-length");

  // Streaming gzip: the shell reaches the browser immediately instead of waiting
  // for the whole document to render, so first paint is not delayed.
  return new Response(response.body.pipeThrough(new CompressionStream("gzip")), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      const normalized = await normalizeCatastrophicSsrResponse(response);
      return await compressResponse(request, normalized);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
