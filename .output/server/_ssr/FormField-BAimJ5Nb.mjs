import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { D as CircleCheck, O as CircleAlert } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FormField-BAimJ5Nb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FormField({ label, htmlFor, error, hint, required, children }) {
	const hintId = (0, import_react.useId)();
	const describedBy = [hint ? hintId : null, error ? `${htmlFor}-error` : null].filter(Boolean).join(" ") || void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				htmlFor,
				className: "field-label",
				children: [label, required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "ms-1 text-gold",
					"aria-hidden": "true",
					children: "*"
				})]
			}),
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: hintId,
				className: "field-hint",
				children: hint
			}),
			(0, import_react.isValidElement)(children) ? (0, import_react.cloneElement)(children, { "aria-describedby": describedBy }) : children,
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				id: `${htmlFor}-error`,
				className: "flex items-center gap-1.5 text-sm font-medium text-danger",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
					className: "h-4 w-4 shrink-0",
					"aria-hidden": "true"
				}), error]
			})
		]
	});
}
function Notice({ tone, children }) {
	const isError = tone === "error";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: isError ? "alert" : "status",
		className: `flex items-start gap-3 rounded-lg border p-4 ${isError ? "border-danger text-danger" : "border-success text-success"} bg-surface`,
		children: [isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
			className: "mt-0.5 h-5 w-5 shrink-0",
			"aria-hidden": "true"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
			className: "mt-0.5 h-5 w-5 shrink-0",
			"aria-hidden": "true"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-ink",
			children
		})]
	});
}
//#endregion
export { Notice as n, FormField as t };
