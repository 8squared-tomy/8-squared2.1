import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-bot2Ewvl.mjs";
import { n as object, r as string } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/access.functions-DgklDXDj.js
var unlockEditor_createServerFn_handler = createServerRpc({
	id: "494dd2083725c6ed9f2c918f56f17ada84ee4bbecf6d6f4a1d4edce5296b5adf",
	name: "unlockEditor",
	filename: "src/lib/admin/access.functions.ts"
}, (opts) => unlockEditor.__executeServer(opts));
var unlockEditor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(object({
	email: string().email(),
	password: string().min(1).max(256)
})).handler(unlockEditor_createServerFn_handler, async ({ data, context }) => {
	const { data: eligible, error } = await context.supabase.rpc("is_editor_identity");
	if (error || eligible !== true) return { ok: false };
	const url = processModule.env["SUPABASE_URL"];
	const key = processModule.env["SUPABASE_PUBLISHABLE_KEY"];
	if (!url || !key) throw Error("Auth unavailable");
	const client = createClient(url, key, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: { fetch: (input, init) => {
			const h = new Headers(init?.headers);
			if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
			h.set("apikey", key);
			return fetch(input, {
				...init,
				headers: h
			});
		} }
	});
	const { data: verified, error: failed } = await client.auth.signInWithPassword(data);
	if (failed || verified.user?.id !== context.userId) return { ok: false };
	if (verified.session) await client.auth.signOut({ scope: "local" });
	const sessionId = context.claims["session_id"];
	if (typeof sessionId !== "string" || !string().uuid().safeParse(sessionId).success) return { ok: false };
	const { supabaseAdmin } = await import("./client.server-CuhZr3oN.mjs");
	const { error: writeError } = await supabaseAdmin.from("editor_sessions").upsert({
		session_id: sessionId,
		user_id: context.userId,
		expires_at: new Date(Date.now() + 18e5).toISOString()
	});
	if (writeError) throw Error("Unable to unlock");
	return { ok: true };
});
var lockEditor_createServerFn_handler = createServerRpc({
	id: "758f17c5228781d6c5e734dcadd18ba30fd83d4ea2f8d3737f6a4cbf947f9627",
	name: "lockEditor",
	filename: "src/lib/admin/access.functions.ts"
}, (opts) => lockEditor.__executeServer(opts));
var lockEditor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(lockEditor_createServerFn_handler, async ({ context }) => {
	const { data: eligible } = await context.supabase.rpc("is_editor_identity");
	if (!eligible) return { ok: true };
	const id = context.claims["session_id"];
	if (typeof id !== "string") return { ok: true };
	const { supabaseAdmin } = await import("./client.server-CuhZr3oN.mjs");
	const { error } = await supabaseAdmin.from("editor_sessions").delete().eq("session_id", id).eq("user_id", context.userId);
	if (error) throw Error("Unable to lock");
	return { ok: true };
});
//#endregion
export { lockEditor_createServerFn_handler, unlockEditor_createServerFn_handler };
