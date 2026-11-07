import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-BEg5oiP4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var VARIANTS = {
	default: "bg-gold text-on-gold hover:brightness-110",
	outline: "border border-border bg-surface text-ink hover:border-gold",
	ghost: "text-ink hover:bg-surface-2",
	secondary: "bg-surface-2 text-ink hover:border-gold border border-transparent",
	danger: "border border-danger text-danger hover:bg-surface-2"
};
var SIZES = {
	default: "min-h-11 px-5 text-sm",
	sm: "min-h-9 px-3 text-sm",
	lg: "min-h-12 px-6 text-base",
	icon: "min-h-11 min-w-11 p-0"
};
function buttonClasses({ variant = "default", size = "default", className } = {}) {
	return cn("inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors disabled:pointer-events-none disabled:opacity-60", VARIANTS[variant], SIZES[size], className);
}
function Button({ variant = "default", size = "default", asChild = false, className, children, ...rest }) {
	const classes = buttonClasses({
		variant,
		size,
		className
	});
	if (asChild && (0, import_react.isValidElement)(children)) {
		const child = children;
		return (0, import_react.cloneElement)(child, { className: cn(classes, child.props.className) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: classes,
		...rest,
		children
	});
}
//#endregion
export { cn as n, Button as t };
