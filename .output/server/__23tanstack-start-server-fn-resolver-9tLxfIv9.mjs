//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-9tLxfIv9.js
var manifest = {
	"494dd2083725c6ed9f2c918f56f17ada84ee4bbecf6d6f4a1d4edce5296b5adf": {
		functionName: "unlockEditor_createServerFn_handler",
		importer: () => import("./_ssr/access.functions-DgklDXDj.mjs")
	},
	"758f17c5228781d6c5e734dcadd18ba30fd83d4ea2f8d3737f6a4cbf947f9627": {
		functionName: "lockEditor_createServerFn_handler",
		importer: () => import("./_ssr/access.functions-DgklDXDj.mjs")
	},
	"ce610591eabd320b5c31f6c9692c047935025fa88815053f2a252efed1b6d194": {
		functionName: "getRequestLanguage_createServerFn_handler",
		importer: () => import("./_ssr/requestLanguage-CuM85vzX.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
