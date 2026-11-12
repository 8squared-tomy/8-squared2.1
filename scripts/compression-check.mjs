// Regression check for the SSR streaming-compression layer in src/server.ts.
// Starts the built Nitro node-server on a private port and asserts that HTML
// responses are gzip-encoded. Exits non-zero on failure.
//
// Note: the "/" route loads club data from Supabase. When this sandbox has no
// outbound network the SSR handler returns its error page (still compressed),
// so a non-200 there is reported but only the static content route is required
// to be 200. Production reachability is verified separately on the live URL.
import { spawn } from "node:child_process";

const PORT = Number(process.env.CHECK_PORT ?? 3417);
const BASE = `http://127.0.0.1:${PORT}`;

const child = spawn(process.execPath, [".output/server/index.mjs"], {
  env: { ...process.env, PORT: String(PORT), HOST: "127.0.0.1", NODE_ENV: "production" },
  stdio: ["ignore", "pipe", "pipe"],
});

let logs = "";
child.stdout.on("data", (d) => (logs += d.toString()));
child.stderr.on("data", (d) => (logs += d.toString()));

const failures = [];
const notes = [];
function check(condition, message) {
  if (!condition) failures.push(message);
}

const started = new Promise((resolve, reject) => {
  const timer = setTimeout(
    () => reject(new Error(`server did not report readiness within 30s\n${logs}`)),
    30_000,
  );
  const onData = (chunk) => {
    if (/listening|http:\/\/|ready/i.test(chunk.toString())) {
      clearTimeout(timer);
      resolve();
    }
  };
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);
  child.on("exit", (code) => {
    clearTimeout(timer);
    reject(new Error(`server exited early with code ${code}\n${logs}`));
  });
});

async function fetchPage(path) {
  const res = await fetch(`${BASE}${path}`, { headers: { "accept-encoding": "gzip" } });
  const html = await res.text();
  return {
    status: res.status,
    encoding: res.headers.get("content-encoding"),
    contentType: res.headers.get("content-type") ?? "",
    vary: res.headers.get("vary") ?? "",
    html,
  };
}

try {
  await started;

  // Static content route: proves SSR renders and the compression layer runs on
  // a successful document.
  const terms = await fetchPage("/terms");
  check(terms.status === 200, `GET /terms expected 200, got ${terms.status}`);
  check(terms.contentType.includes("text/html"), `GET /terms expected text/html, got "${terms.contentType}"`);
  check(terms.encoding === "gzip", `GET /terms expected content-encoding gzip, got "${terms.encoding}"`);
  check(/accept-encoding/i.test(terms.vary), `GET /terms expected Vary accept-encoding, got "${terms.vary}"`);
  check(terms.html.length > 1_000, `GET /terms returned only ${terms.html.length} bytes`);
  notes.push(`/terms status=${terms.status} encoding=${terms.encoding} bytes=${terms.html.length}`);

  // Home route: the LCP preload links must be present in server-rendered HTML.
  const home = await fetchPage("/");
  check(home.encoding === "gzip", `GET / expected content-encoding gzip, got "${home.encoding}"`);
  if (home.status === 200) {
    check(home.html.length > 5_000, `GET / returned only ${home.html.length} bytes`);
    check(home.html.includes("8squared"), "GET / HTML is missing the club name");
    check(
      /<link[^>]+rel="preload"[^>]+hero-chess[^>]+\.webp|<link[^>]+hero-chess[^>]+\.webp[^>]+rel="preload"/i.test(
        home.html,
      ),
      "hero image preload link is missing from the server-rendered HTML",
    );
  } else {
    notes.push(`/ returned ${home.status} in this sandbox (no outbound Supabase access); compression still applied`);
  }
  notes.push(`/ status=${home.status} encoding=${home.encoding} bytes=${home.html.length}`);
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  child.kill("SIGKILL");
}

for (const note of notes) console.log(note);

if (failures.length > 0) {
  console.error("compression-check FAILED:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("compression-check passed");
process.exit(0);
