import { n as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageProvider-BkuMpPKM.mjs";
import { a as fetchActiveSponsors, d as isSafeHttpsUrl } from "./publicApi-BNNW0lc7.mjs";
import { t as useAsyncData } from "./useAsyncData-BRqhOT1q.mjs";
import { w as ExternalLink } from "../_libs/lucide-react.mjs";
import { n as Notice } from "./FormField-BAimJ5Nb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sponsors-BwNyrgen.js
var import_jsx_runtime = require_jsx_runtime();
function SponsorsPage() {
	const { t, pick } = useLanguage();
	const sponsors = useAsyncData(fetchActiveSponsors, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: t("navSponsors")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-4xl",
				children: t("sponsorsTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-lg text-muted",
				children: t("sponsorsIntro")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12",
				children: [
					sponsors.loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("loading")
					}),
					sponsors.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
						tone: "error",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: sponsors.reload,
							className: "btn-ghost mt-2 px-0 text-danger",
							children: t("retry")
						})]
					}),
					sponsors.data && sponsors.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("emptySponsors")
					}),
					sponsors.data && sponsors.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: sponsors.data.map((sponsor) => {
							const description = pick(sponsor.description_en, sponsor.description_ar);
							const logo = sponsor.logo_url && isSafeHttpsUrl(sponsor.logo_url) ? sponsor.logo_url : null;
							const website = sponsor.website_url && isSafeHttpsUrl(sponsor.website_url) ? sponsor.website_url : null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "card flex flex-col gap-4",
								children: [
									logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: logo,
										alt: sponsor.name,
										loading: "lazy",
										referrerPolicy: "no-referrer",
										className: "h-16 w-auto max-w-[60%] object-contain object-left"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-2xl font-bold text-gold",
										children: sponsor.name
									}),
									logo && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-xl",
										children: sponsor.name
									}),
									description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted",
										children: description
									}),
									website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: website,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "btn-ghost mt-auto px-0 text-gold",
										children: [
											t("sponsorVisit"),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "sr-only",
												children: [": ", sponsor.name]
											})
										]
									})
								]
							}, sponsor.id);
						})
					})
				]
			})
		]
	});
}
var SplitComponent = SponsorsPage;
//#endregion
export { SplitComponent as component };
