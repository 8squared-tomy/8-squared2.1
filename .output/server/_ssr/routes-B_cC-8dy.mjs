import { n as __toESM } from "../_runtime.mjs";
import { b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BEg5oiP4.mjs";
import { n as useLanguage } from "./LanguageProvider-CQ4v6zaN.mjs";
import { d as Play, i as Trophy, j as ArrowRight, m as Pause, n as Users, o as Shield } from "../_libs/lucide-react.mjs";
import { t as Modal } from "./Modal-3BmmUOJB.mjs";
import { n as Notice } from "./FormField-BAimJ5Nb.mjs";
import { t as EventCard } from "./EventCard-C3Cz1VsX.mjs";
import { t as Route } from "./routes-D1bnyshu.mjs";
import { t as useEmblaCarousel } from "../_libs/embla-carousel-react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_cC-8dy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AUTOPLAY_MS = 4500;
function initials(name) {
	return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join("").toUpperCase();
}
function usePrefersReducedMotion() {
	const [reduce, setReduce] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const update = () => setReduce(query.matches);
		update();
		query.addEventListener("change", update);
		return () => query.removeEventListener("change", update);
	}, []);
	return reduce;
}
function MemberCarousel({ members }) {
	const { language } = useLanguage();
	const ar = language === "ar";
	const list = members ?? [];
	const [ref, api] = useEmblaCarousel({
		align: "center",
		loop: true,
		containScroll: false,
		duration: 45,
		direction: ar ? "rtl" : "ltr"
	});
	const [active, setActive] = (0, import_react.useState)(0);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [userPaused, setUserPaused] = (0, import_react.useState)(false);
	const [hovering, setHovering] = (0, import_react.useState)(false);
	const reduceMotion = usePrefersReducedMotion();
	(0, import_react.useEffect)(() => {
		if (!api) return;
		const update = () => setActive(api.selectedScrollSnap());
		update();
		api.on("select", update);
		api.on("reInit", update);
		return () => {
			api.off("select", update);
			api.off("reInit", update);
		};
	}, [api]);
	const playing = !userPaused && !hovering && !selected && !reduceMotion && list.length > 1;
	(0, import_react.useEffect)(() => {
		if (!api || !playing) return;
		const id = window.setInterval(() => api.scrollNext(), AUTOPLAY_MS);
		return () => window.clearInterval(id);
	}, [api, playing]);
	if (list.length === 0) return null;
	const current = list[active] ?? list[0];
	const pauseLabel = userPaused ? ar ? "تشغيل الحركة التلقائية" : "Play automatic scrolling" : ar ? "إيقاف الحركة التلقائية" : "Pause automatic scrolling";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "border-t border-border py-12",
		"aria-label": ar ? "أعضاء النادي" : "Club members",
		onMouseEnter: () => setHovering(true),
		onMouseLeave: () => setHovering(false),
		onFocus: () => setHovering(true),
		onBlur: (event) => {
			if (!event.currentTarget.contains(event.relatedTarget)) setHovering(false);
		},
		onTouchStart: () => setHovering(true),
		onTouchEnd: () => setHovering(false),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 sm:px-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl sm:text-2xl",
					children: ar ? "أعضاء النادي" : "Our members"
				}), list.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setUserPaused((paused) => !paused),
					"aria-pressed": userPaused,
					"aria-label": pauseLabel,
					title: pauseLabel,
					className: "inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-gold hover:text-gold",
					children: userPaused ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mt-6 max-w-xl overflow-hidden px-4",
				ref,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex touch-pan-y items-center py-2",
					children: list.map((member, index) => {
						const isActive = index === active;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0 flex-[0_0_auto] px-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-label": member.name,
								"aria-current": isActive ? "true" : void 0,
								onClick: () => {
									api?.scrollTo(index);
									setSelected(member);
								},
								className: `block h-14 w-14 overflow-hidden rounded-full border transition-all duration-500 ease-out sm:h-16 sm:w-16 ${isActive ? "scale-110 border-gold shadow-md ring-2 ring-gold/40" : "scale-90 border-border opacity-55 hover:opacity-90"}`,
								children: member.photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: member.photo_url,
									alt: "",
									loading: "lazy",
									decoding: "async",
									className: "h-full w-full object-cover"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-full w-full items-center justify-center bg-surface-2 text-sm font-semibold text-muted",
									children: initials(member.name)
								})
							})
						}, member.id);
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 min-h-12 px-4 text-center transition-opacity duration-500",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: current.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: current.club_role
				})]
			}),
			list.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex justify-center gap-1",
				children: list.map((member, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => api?.scrollTo(index),
					"aria-label": `${ar ? "عرض العضو" : "Show member"} ${index + 1}`,
					className: "flex h-8 w-6 items-center justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 rounded-full transition-all duration-500 ${index === active ? "w-5 bg-gold" : "w-1.5 bg-border"}` })
				}, member.id))
			}),
			selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				title: selected.name,
				onClose: () => setSelected(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-4",
					children: [selected.photo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: selected.photo_url,
						alt: selected.name,
						className: "h-32 w-32 rounded-full object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-gold",
						children: selected.club_role
					})]
				})
			})
		]
	});
}
var COVER_IMAGE = "/chess-cover.jpg";
function HomePage({ loaded }) {
	const { t, pick } = useLanguage();
	const { content, events, links, members } = loaded;
	const router = useRouter();
	const reload = () => void router.invalidate();
	const getText = (key) => {
		const entry = content.data?.find((item) => item.key === key);
		return entry ? pick(entry.value_en, entry.value_ar) : "";
	};
	const upcoming = (events.data?.events ?? []).filter((event) => new Date(event.ends_at ?? event.starts_at).getTime() >= Date.now()).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden bg-cover text-on-cover",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: COVER_IMAGE,
					alt: t("heroImageAlt"),
					className: "absolute inset-0 -z-10 h-full w-full object-cover",
					width: 940,
					height: 650,
					fetchPriority: "high"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 -z-10 bg-gradient-to-b from-cover/80 via-cover/70 to-cover",
					"aria-hidden": "true"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex min-h-[70vh] max-w-6xl flex-col justify-center gap-6 px-4 py-20 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow text-cover-accent",
							children: t("heroEyebrow")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "max-w-3xl text-4xl text-on-cover sm:text-6xl",
							children: getText("hero_title") || t("brand")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "max-w-2xl text-lg leading-relaxed text-on-cover",
							children: getText("hero_subtitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3 sm:flex-row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/membership",
								className: "btn-primary",
								children: [t("heroCtaJoin"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
									className: "h-4 w-4 rtl:rotate-180",
									"aria-hidden": "true"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "btn-secondary h-auto border-on-cover/40 bg-cover text-on-cover hover:border-cover-accent hover:text-cover-accent",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/events",
									children: t("heroCtaEvents")
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "eyebrow",
						children: t("brand")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-3xl sm:text-4xl",
						children: t("aboutTitle")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg leading-relaxed text-muted",
					children: getText("about_body")
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-6 md:grid-cols-3",
				children: [
					{
						icon: Users,
						title: t("cardJoinTitle"),
						body: t("cardJoinBody"),
						href: "/membership"
					},
					{
						icon: Trophy,
						title: t("cardEventsTitle"),
						body: t("cardEventsBody"),
						href: "/events"
					},
					{
						icon: Shield,
						title: t("cardSponsorsTitle"),
						body: t("cardSponsorsBody"),
						href: "/sponsors"
					}
				].map(({ icon: Icon, title, body, href }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href,
					className: "card group flex flex-col gap-4 hover:-translate-y-1 hover:border-gold",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-10 w-10 items-center justify-center rounded-full border border-gold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-5 w-5 text-gold",
								"aria-hidden": "true"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: body
						})
					]
				}, href))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemberCarousel, { members: members.data }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-surface",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex flex-wrap items-end justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow mb-2",
							children: t("navEvents")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-3xl",
							children: t("eventsPreviewTitle")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/events",
							className: "btn-ghost",
							children: [t("eventsViewAll"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-4 w-4 rtl:rotate-180",
								"aria-hidden": "true"
							})]
						})]
					}),
					events.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
						tone: "error",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: reload,
							className: "btn-ghost mt-2 px-0 text-danger",
							children: t("retry")
						})]
					}),
					events.data && upcoming.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("emptyEvents")
					}),
					events.data && upcoming.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-6 md:grid-cols-3",
						children: upcoming.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventCard, {
							event,
							confirmedCount: events.data?.counts[event.id] ?? 0
						}, event.id))
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-3xl",
					children: t("linksTitle")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-muted",
					children: t("linksIntro")
				}),
				links.data && links.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 text-muted",
					children: t("emptyLinks")
				}),
				links.data && links.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: links.data.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: link.url,
						target: "_blank",
						rel: "noopener noreferrer",
						className: "card flex min-h-11 items-center justify-between gap-3 hover:border-gold hover:text-gold",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: pick(link.label_en, link.label_ar)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
								className: "h-4 w-4 shrink-0 rtl:rotate-180",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sr-only",
								children: [
									"(",
									t("sponsorVisit"),
									")"
								]
							})
						]
					}) }, link.id))
				})
			]
		})
	] });
}
function HomeRoute() {
	const loaded = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomePage, { loaded });
}
//#endregion
export { HomeRoute as component };
