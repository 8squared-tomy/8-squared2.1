import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageProvider-CQ4v6zaN.mjs";
import { A as CalendarDays, g as MapPin } from "../_libs/lucide-react.mjs";
import { n as getEventState, r as seatsLeft, t as formatDateTime } from "./events-BEcXuI1l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EventCard-C3Cz1VsX.js
var import_jsx_runtime = require_jsx_runtime();
var STATE_LABEL = {
	open: "registrationOpenLabel",
	full: "eventFull",
	closed: "eventClosed",
	past: "eventPast"
};
var STATE_CLASS = {
	open: "border-success text-success",
	full: "border-danger text-danger",
	closed: "border-border text-muted",
	past: "border-border text-muted"
};
function EventStateBadge({ state, seats }) {
	const { t } = useLanguage();
	const label = state === "open" ? seats === null ? t("eventUnlimited") : t("eventSeatsLeft", { n: seats }) : t(STATE_LABEL[state]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATE_CLASS[state]}`,
		children: label
	});
}
function EventCard({ event, confirmedCount }) {
	const { t, pick, language } = useLanguage();
	const state = getEventState(event, confirmedCount);
	const title = pick(event.title_en, event.title_ar);
	const location = pick(event.location_en, event.location_ar);
	const seats = seatsLeft(event, confirmedCount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "card flex h-full flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventStateBadge, {
					state,
					seats
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `/events/${event.id}`,
						className: "hover:text-gold",
						children: title
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "space-y-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
						className: "h-4 w-4 shrink-0 text-gold",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateTime(event.starts_at, language) })]
				}), location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
						className: "h-4 w-4 shrink-0 text-gold",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: location })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: `/events/${event.id}`,
				className: "btn-secondary mt-auto justify-center",
				children: t("eventRegisterTitle")
			})
		]
	});
}
//#endregion
export { EventStateBadge as n, EventCard as t };
