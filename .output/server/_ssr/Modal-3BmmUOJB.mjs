import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageProvider-CQ4v6zaN.mjs";
import { t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Modal-3BmmUOJB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Modal({ title, onClose, children }) {
	const { t } = useLanguage();
	const titleId = (0, import_react.useId)();
	const dialogRef = (0, import_react.useRef)(null);
	const onCloseRef = (0, import_react.useRef)(onClose);
	(0, import_react.useEffect)(() => {
		onCloseRef.current = onClose;
	});
	(0, import_react.useEffect)(() => {
		dialogRef.current?.focus();
		const onKeyDown = (event) => {
			if (event.key === "Escape") onCloseRef.current();
		};
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 sm:items-center sm:p-4",
		onMouseDown: (event) => {
			if (event.target === event.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: dialogRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": titleId,
			tabIndex: -1,
			className: "card max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-b-none focus:outline-none sm:rounded-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 flex items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					id: titleId,
					className: "text-2xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": t("actionClose"),
					className: "btn-ghost -me-2 h-11 w-11 shrink-0 px-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
						className: "h-5 w-5",
						"aria-hidden": "true"
					})
				})]
			}), children]
		})
	});
}
//#endregion
export { Modal as t };
