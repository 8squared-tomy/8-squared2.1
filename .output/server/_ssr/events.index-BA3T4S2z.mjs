import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageProvider-BkuMpPKM.mjs";
import { l as fetchPublishedEvents, s as fetchEventSeatCounts } from "./publicApi-BNNW0lc7.mjs";
import { t as useAsyncData } from "./useAsyncData-BRqhOT1q.mjs";
import { n as Notice } from "./FormField-BAimJ5Nb.mjs";
import { n as getEventState } from "./events-DH_i7NCn.mjs";
import { t as EventCard } from "./EventCard-YdFoq_fl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events.index-BA3T4S2z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usePublicEvents() {
	return useAsyncData(async () => {
		const [events, counts] = await Promise.all([fetchPublishedEvents(), fetchEventSeatCounts()]);
		return {
			events,
			counts
		};
	}, []);
}
var FILTERS = [
	{
		value: "all",
		labelKey: "filterAll"
	},
	{
		value: "upcoming",
		labelKey: "filterUpcoming"
	},
	{
		value: "past",
		labelKey: "filterPast"
	}
];
function EventsPage() {
	const { t } = useLanguage();
	const { data, loading, error, reload } = usePublicEvents();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const visible = (data?.events ?? []).map((event) => {
		const confirmedCount = data?.counts[event.id] ?? 0;
		return {
			event,
			confirmedCount,
			past: getEventState(event, confirmedCount) === "past"
		};
	}).filter((entry) => filter === "all" || filter === "past" === entry.past).sort((a, b) => {
		const diff = new Date(a.event.starts_at).getTime() - new Date(b.event.starts_at).getTime();
		return filter === "past" ? -diff : diff;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: t("navEvents")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-4xl",
				children: t("eventsTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted",
				children: t("eventsIntro")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "group",
				"aria-label": t("filterLabel"),
				className: "mt-8 flex flex-wrap gap-2",
				children: FILTERS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					"aria-pressed": filter === option.value,
					onClick: () => setFilter(option.value),
					className: `min-h-11 rounded-full border px-5 text-sm font-semibold transition-colors duration-200 ${filter === option.value ? "border-gold bg-gold text-on-gold" : "border-border bg-surface text-ink hover:border-gold"}`,
					children: t(option.labelKey)
				}, option.value))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("loading")
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
						tone: "error",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: reload,
							className: "btn-ghost mt-2 px-0 text-danger",
							children: t("retry")
						})]
					}),
					data && visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("emptyEvents")
					}),
					data && visible.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 md:grid-cols-2 lg:grid-cols-3",
						children: visible.map(({ event, confirmedCount }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
							event,
							confirmedCount
						}, event.id))
					})
				]
			})
		]
	});
}
var SplitComponent = EventsPage;
//#endregion
export { SplitComponent as component };
