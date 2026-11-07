import { r as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useAsyncData-BRqhOT1q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useAsyncData(loader, deps) {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		error: false,
		loading: true
	});
	const [version, setVersion] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let active = true;
		setState((current) => ({
			...current,
			loading: true,
			error: false
		}));
		loader().then((data) => {
			if (active) setState({
				data,
				error: false,
				loading: false
			});
		}).catch(() => {
			if (active) setState({
				data: null,
				error: true,
				loading: false
			});
		});
		return () => {
			active = false;
		};
	}, [...deps, version]);
	return {
		...state,
		reload: () => setVersion((value) => value + 1)
	};
}
//#endregion
export { useAsyncData as t };
