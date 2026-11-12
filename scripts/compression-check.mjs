// Regression check for the SSR streaming-compression layer in src/server.ts.
// Starts the built Nitro node-server on a private port, makes ONE request and
// asserts the HTML response is gzip-encoded. Exits non-zero on failure.
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

try {
  await started;

  const res = await fetch(`${BASE}/`, { headers: { "accept-encoding": "gzip" } });
  const encoding = res.headers.get("content-encoding");
  const contentType = res.headers.get("content-type") ?? "";
  const vary = res.headers.get("vary") ?? "";
  const html = await res.text();

  check(res.status === 200, `expected HTTP 200, got ${res.status}`);
  check(contentType.includes("text/html"), `expected text/html, got "${contentType}"`);
  check(encoding === "gzip", `expected content-encoding gzip, got "${encoding}"`);
  check(/accept-encoding/i.test(vary), `expected Vary to include accept-encoding, got "${vary}"`);
  check(html.includes("8squared"), "rendered HTML is missing the club name");
  check(html.length > 5_000, `HTML payload looks empty (${html.length} bytes)`);
  check(
    /rel="preload"[^>]*hero-chess[^>]*webp|hero-chess[^>]*webp[^>]*rel="preload"/i.test(html),
    "hero image preload link is missing from the server-rendered HTML",
  );

  console.log(
    `status=${res.status} content-encoding=${encoding} bytes=${html.length} vary="${vary}"`,
  );
} catch (error) {
  failures.push(error instanceof Error ? error.message : String(error));
} finally {
  child.kill("SIGKILL");
}

if (failures.length > 0) {
  console.error("compression-check FAILED:");
  for (const failure of failures) console.error(` - ${failure}`);
  process.exit(1);
}

console.log("compression-check passed");
process.exit(0);
