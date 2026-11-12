// Regression check for the SSR streaming-compression layer in src/server.ts.
//
// Starts the built Nitro node-server on a private port and verifies content
// negotiation: an HTML response is gzip-encoded when the client offers gzip,
// and left uncompressed when it does not. Exits non-zero on failure.
//
// The HTTP status is reported but not asserted: this sandbox has no
// SUPABASE_SERVICE_ROLE_KEY, so every route renders the app's error page here.
// Page rendering itself is verified against the deployed URL.
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

async function fetchPage(acceptEncoding) {
  const res = await fetch(`${BASE}/`, { headers: { "accept-encoding": acceptEncoding } });
  const body = await res.text();
  return {
    status: res.status,
    encoding: res.headers.get("content-encoding"),
    contentType: res.headers.get("content-type") ?? "",
    vary: res.headers.get("vary") ?? "",
    bytes: body.length,
  };
}

try {
  await started;

  const compressed = await fetchPage("gzip");
  check(compressed.contentType.includes("text/html"), `expected text/html, got "${compressed.contentType}"`);
  check(compressed.encoding === "gzip", `gzip client expected content-encoding gzip, got "${compressed.encoding}"`);
  check(/accept-encoding/i.test(compressed.vary), `expected Vary accept-encoding, got "${compressed.vary}"`);
  check(compressed.bytes > 500, `HTML body too small (${compressed.bytes} bytes)`);
  notes.push(
    `gzip client  -> status=${compressed.status} encoding=${compressed.encoding} bytes=${compressed.bytes} vary="${compressed.vary}"`,
  );

  const plain = await fetchPage("identity");
  check(plain.encoding === null, `identity client must not get content-encoding, got "${plain.encoding}"`);
  notes.push(`identity client -> status=${plain.status} encoding=${plain.encoding} bytes=${plain.bytes}`);
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
