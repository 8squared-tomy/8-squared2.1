import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as createServerRpc } from "./createServerRpc-CxD4EZ5P.mjs";
import { t as getRequest } from "./request-response-B7GxCXoC.mjs";
import { t as readLanguageCookie } from "./language-BNxNOAtw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/requestLanguage-CuM85vzX.js
var getRequestLanguage_createServerFn_handler = createServerRpc({
	id: "ce610591eabd320b5c31f6c9692c047935025fa88815053f2a252efed1b6d194",
	name: "getRequestLanguage",
	filename: "src/i18n/requestLanguage.ts"
}, (opts) => getRequestLanguage.__executeServer(opts));
var getRequestLanguage = createServerFn({ method: "GET" }).handler(getRequestLanguage_createServerFn_handler, async () => {
	return readLanguageCookie(getRequest().headers.get("cookie") ?? "");
});
//#endregion
export { getRequestLanguage_createServerFn_handler };
