import { n as __toESM } from "../_runtime.mjs";
import { _ as lazyRouteComponent, b as useRouter, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { n as require_jsx_runtime, r as require_react, t as QueryClientProvider } from "../_libs/react+tanstack__react-query.mjs";
import { n as cn, t as Button } from "./button-BEg5oiP4.mjs";
import { t as readLanguageCookie } from "./language-BNxNOAtw.mjs";
import { n as useLanguage, t as LanguageProvider } from "./LanguageProvider-CQ4v6zaN.mjs";
import { d as isSafeHttpsUrl, u as fetchSiteContent } from "./publicApi-df8cJKU-.mjs";
import { t as useAsyncData } from "./useAsyncData-BRqhOT1q.mjs";
import { t as createSsrRpc } from "./createSsrRpc-MUowDJDk.mjs";
import { C as Globe, E as Contrast, S as House, b as Linkedin, c as Send, h as Menu, i as Trophy, j as ArrowRight, k as ChevronDown, n as Users, o as Shield, r as Type, x as Instagram } from "../_libs/lucide-react.mjs";
import { t as Route$6 } from "./events._eventId-DVquISPW.mjs";
import { n as fetchSocialLinks, t as Route$7 } from "./routes-D1bnyshu.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CkIQVLOQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-b7d-4uZW.css";
function reportError(error, context = {}) {
	if (typeof window === "undefined") return;
	console.error("[app-error]", describeThrown(error), {
		route: window.location.pathname,
		...context
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
var SheetContext = (0, import_react.createContext)(null);
function useSheet(component) {
	const context = (0, import_react.useContext)(SheetContext);
	if (!context) throw new Error(`${component} must be used inside <Sheet>`);
	return context;
}
function Sheet({ open, onOpenChange, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContext.Provider, {
		value: {
			open,
			onOpenChange
		},
		children
	});
}
function SheetTrigger({ children }) {
	const { open, onOpenChange } = useSheet("SheetTrigger");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		onClick: () => onOpenChange(!open),
		className: "contents",
		children
	});
}
function SheetContent({ side = "left", className, children }) {
	const { open, onOpenChange } = useSheet("SheetContent");
	const panel = (0, import_react.useRef)(null);
	const close = (0, import_react.useCallback)(() => onOpenChange(false), [onOpenChange]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKeyDown = (event) => {
			if (event.key === "Escape") close();
		};
		document.addEventListener("keydown", onKeyDown);
		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		(panel.current?.querySelector("button, a[href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])"))?.focus();
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.body.style.overflow = previousOverflow;
		};
	}, [open, close]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-0 bg-black/60",
			"aria-hidden": "true",
			onClick: close
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: panel,
			role: "dialog",
			"aria-modal": "true",
			className: cn("absolute inset-y-0 flex w-[min(22rem,88vw)] flex-col bg-surface shadow-xl", side === "right" ? "end-0" : "start-0", className),
			children
		})]
	});
}
function SheetTitle({ className, children }) {
	const id = (0, import_react.useId)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		id,
		className: cn("text-base font-bold text-ink", className),
		children
	});
}
function SheetDescription({ className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: cn("text-sm text-muted", className),
		children
	});
}
var STORAGE_KEY = "8squared:preferences";
var DEFAULTS = {
	theme: "system",
	font: "normal",
	contrast: false
};
var PreferencesContext = (0, import_react.createContext)(null);
function readStored() {
	if (typeof window === "undefined") return DEFAULTS;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return DEFAULTS;
		const parsed = JSON.parse(raw);
		return {
			theme: parsed.theme === "light" || parsed.theme === "dark" ? parsed.theme : "system",
			font: parsed.font === "large" || parsed.font === "xlarge" ? parsed.font : "normal",
			contrast: parsed.contrast === true
		};
	} catch {
		return DEFAULTS;
	}
}
function applyPreferences({ theme, font, contrast }) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
	const dark = theme === "dark" || theme === "system" && prefersDark;
	root.classList.toggle("dark", dark);
	root.classList.toggle("contrast", contrast);
	root.dataset["font"] = font;
	root.style.colorScheme = dark ? "dark" : "light";
}
function PreferencesProvider({ children }) {
	const [preferences, setPreferences] = (0, import_react.useState)(readStored);
	(0, import_react.useEffect)(() => {
		applyPreferences(preferences);
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
		} catch {}
	}, [preferences]);
	(0, import_react.useEffect)(() => {
		if (preferences.theme !== "system" || typeof window === "undefined" || !window.matchMedia) return;
		const query = window.matchMedia("(prefers-color-scheme: dark)");
		const onChange = () => applyPreferences(preferences);
		query.addEventListener("change", onChange);
		return () => query.removeEventListener("change", onChange);
	}, [preferences]);
	const setTheme = (0, import_react.useCallback)((theme) => setPreferences((current) => ({
		...current,
		theme
	})), []);
	const setFont = (0, import_react.useCallback)((font) => setPreferences((current) => ({
		...current,
		font
	})), []);
	const toggleContrast = (0, import_react.useCallback)(() => setPreferences((current) => ({
		...current,
		contrast: !current.contrast
	})), []);
	const value = (0, import_react.useMemo)(() => ({
		...preferences,
		setTheme,
		setFont,
		toggleContrast
	}), [
		preferences,
		setTheme,
		setFont,
		toggleContrast
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesContext.Provider, {
		value,
		children
	});
}
function usePreferences() {
	const context = (0, import_react.useContext)(PreferencesContext);
	if (!context) throw new Error("usePreferences must be used inside <PreferencesProvider>");
	return context;
}
var THEMES = [
	{
		value: "system",
		labelKey: "themeSystem"
	},
	{
		value: "light",
		labelKey: "themeLight"
	},
	{
		value: "dark",
		labelKey: "themeDark"
	}
];
var FONTS = [
	{
		value: "normal",
		labelKey: "fontNormal"
	},
	{
		value: "large",
		labelKey: "fontLarge"
	},
	{
		value: "xlarge",
		labelKey: "fontXlarge"
	}
];
function AccessibilityMenu() {
	const { t } = useLanguage();
	const { theme, font, contrast, setTheme, setFont, toggleContrast } = usePreferences();
	const [open, setOpen] = (0, import_react.useState)(false);
	const optionClasses = (active) => `min-h-11 flex-1 rounded-md border px-3 text-sm font-semibold transition-colors ${active ? "border-gold bg-gold text-on-gold" : "border-border bg-surface text-ink hover:border-gold"}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((value) => !value),
			"aria-expanded": open,
			className: "btn-ghost min-h-11 w-full justify-between px-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Type, {
					className: "h-4 w-4",
					"aria-hidden": "true"
				}), t("accessibility")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, {
				className: `h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`,
				"aria-hidden": "true"
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "field-label",
						children: t("themeLabel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: THEMES.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": theme === option.value,
							onClick: () => setTheme(option.value),
							className: optionClasses(theme === option.value),
							children: t(option.labelKey)
						}, option.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "field-label",
						children: t("fontLabel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-2",
						children: FONTS.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-pressed": font === option.value,
							onClick: () => setFont(option.value),
							className: optionClasses(font === option.value),
							children: t(option.labelKey)
						}, option.value))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					"aria-pressed": contrast,
					onClick: toggleContrast,
					className: `flex min-h-11 w-full items-center justify-center gap-2 rounded-md border px-3 text-sm font-semibold transition-colors ${contrast ? "border-gold bg-gold text-on-gold" : "border-border bg-surface text-ink hover:border-gold"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contrast, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), t("contrastLabel")]
				})
			]
		})]
	});
}
function SiteLogo({ url, className }) {
	if (url) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: url,
		alt: "",
		"aria-hidden": "true",
		className: `shrink-0 rounded-sm object-contain ${className ?? ""}`
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 24 24",
		"aria-hidden": "true",
		focusable: "false",
		className: `shrink-0 text-gold ${className ?? ""}`,
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.8",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4h5l-1 4 4 5v5H6v-5l4-5-1-4Z" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M6 18h12" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M10 11h4" })
		]
	});
}
function SiteHeader({ path, logoUrl }) {
	const { t, language, setLanguage } = useLanguage();
	const [open, setOpen] = (0, import_react.useState)(false);
	const side = language === "ar" ? "right" : "left";
	const items = [
		{
			href: "/",
			label: t("navHome"),
			icon: House
		},
		{
			href: "/membership",
			label: t("navMembership"),
			icon: Users
		},
		{
			href: "/events",
			label: t("navEvents"),
			icon: Trophy
		},
		{
			href: "/sponsors",
			label: t("navSponsors"),
			icon: Shield
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-app/95 backdrop-blur",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/",
				className: "flex min-h-11 items-center gap-2",
				"aria-label": t("brand"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, {
					url: logoUrl,
					className: "h-5 w-5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-base font-bold text-gold",
					children: t("brand")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted",
					children: t("brandTagline")
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				open,
				onOpenChange: setOpen,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "min-h-11 min-w-11",
						"aria-label": t("openMenu"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side,
					className: "flex flex-col gap-0 overflow-hidden border-border bg-surface p-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 border-b border-border px-6 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, {
								url: logoUrl,
								className: "h-7 w-7"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
										className: "text-start text-base font-bold text-gold",
										children: t("brand")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted",
										children: t("brandTagline")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
										className: "sr-only",
										children: t("mainMenu")
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							"aria-label": t("mainMenu"),
							className: "flex-1 overflow-y-auto px-3 py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1",
								children: items.map(({ href, label, icon: Icon }) => {
									const active = path === href;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href,
										onClick: () => setOpen(false),
										"aria-current": active ? "page" : void 0,
										className: `relative flex min-h-12 items-center gap-3 rounded-md px-4 text-base transition-colors ${active ? "bg-surface-2 font-semibold text-gold" : "text-ink hover:bg-surface-2"}`,
										children: [
											active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												"aria-hidden": "true",
												className: "absolute inset-y-2 start-0 w-1 rounded-full bg-gold"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
												className: "h-5 w-5 shrink-0",
												"aria-hidden": "true"
											}),
											label
										]
									}) }, href);
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 border-t border-border px-6 py-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "min-h-11 w-full justify-center",
								onClick: () => setLanguage(language === "en" ? "ar" : "en"),
								"aria-label": language === "en" ? "Switch language to Arabic" : "التبديل إلى الإنجليزية",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, {
									className: "h-4 w-4",
									"aria-hidden": "true"
								}), t("switchLanguage")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessibilityMenu, {})]
						})
					]
				})]
			})]
		})
	});
}
function useSiteLogo() {
	const value = useAsyncData(fetchSiteContent, []).data?.find((item) => item.key === "site_logo")?.value_en.trim() ?? "";
	return value && isSafeHttpsUrl(value) ? value : null;
}
function SocialLinks() {
	const links = useAsyncData(fetchSocialLinks, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2",
		children: [
			{
				key: "linkedin",
				label: "LinkedIn",
				icon: Linkedin
			},
			{
				key: "instagram",
				label: "Instagram",
				icon: Instagram
			},
			{
				key: "telegram",
				label: "Telegram",
				icon: Send
			}
		].map(({ key, label, icon: Icon }) => {
			const link = links.data?.find((l) => l.platform === key);
			return link && isSafeHttpsUrl(link.url) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: link.url,
				target: "_blank",
				rel: "noopener noreferrer",
				"aria-label": label,
				title: label,
				className: "flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-muted hover:border-gold hover:text-gold",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}, key) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-label": label,
				title: label,
				className: "flex min-h-11 min-w-11 items-center justify-center text-muted/50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}, key);
		})
	});
}
function SiteLayout({ path, children }) {
	const { t } = useLanguage();
	const logoUrl = useSiteLogo();
	const year = (/* @__PURE__ */ new Date()).getFullYear();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col bg-app text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-gold focus:px-4 focus:py-2 focus:text-on-gold",
				children: t("skipToContent")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {
				path,
				logoUrl
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				className: "flex-1",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
				className: "border-t border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLogo, {
									url: logoUrl,
									className: "h-5 w-5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-gold",
									children: t("brand")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "max-w-sm text-muted",
								children: t("footerTagline")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialLinks, {})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						"aria-label": t("footerNav"),
						className: "md:justify-self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "grid grid-cols-2 gap-x-8 gap-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "inline-flex min-h-11 items-center hover:text-gold",
									href: "/",
									children: t("navHome")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "inline-flex min-h-11 items-center hover:text-gold",
									href: "/membership",
									children: t("navMembership")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "inline-flex min-h-11 items-center hover:text-gold",
									href: "/events",
									children: t("navEvents")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "inline-flex min-h-11 items-center hover:text-gold",
									href: "/sponsors",
									children: t("navSponsors")
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "inline-flex min-h-11 items-center hover:text-gold",
									href: "/terms",
									children: t("navLegal")
								}) })
							]
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-4 py-4 text-center text-sm text-muted sm:px-6",
					children: [
						"© ",
						year,
						" ",
						t("brand"),
						". ",
						t("footerRights")
					]
				})]
			})
		]
	});
}
var getRequestLanguage = createServerFn({ method: "GET" }).handler(createSsrRpc("ce610591eabd320b5c31f6c9692c047935025fa88815053f2a252efed1b6d194"));
function NotFoundPage() {
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto flex max-w-2xl flex-col items-start gap-6 px-4 py-24 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-4xl",
				children: t("notFoundTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-lg text-muted",
				children: t("notFoundBody")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "/",
				className: "btn-primary",
				children: [t("backHome"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {
					className: "h-4 w-4 rtl:rotate-180",
					"aria-hidden": "true"
				})]
			})
		]
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-app px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-ink",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "btn-primary",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "btn-secondary",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$5 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "8squared Chess Club" },
			{
				name: "description",
				content: "A home for chess players at every level."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			...[],
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	loader: async () => ({ language: typeof window === "undefined" ? await getRequestLanguage() : readLanguageCookie(document.cookie) }),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundPage,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	const language = useRouterState({ select: (state) => (state.matches[0]?.loaderData)?.language ?? "en" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: language,
		dir: language === "ar" ? "rtl" : "ltr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function useInternalLinkNavigation() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const onClick = (event) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const anchor = event.target?.closest?.("a");
			if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
			const href = anchor.getAttribute("href");
			if (!href || !href.startsWith("/") || href.startsWith("//")) return;
			event.preventDefault();
			router.navigate({ href });
		};
		document.addEventListener("click", onClick);
		return () => document.removeEventListener("click", onClick);
	}, [router]);
}
function SiteFrame({ children, language }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	useInternalLinkNavigation();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LanguageProvider, {
		initialLanguage: language,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, {
			path: path.length > 1 ? path.replace(/\/$/, "") : path,
			children
		})
	}) });
}
function RootComponent() {
	const { queryClient } = Route$5.useRouteContext();
	const { language } = Route$5.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFrame, {
			language,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
		})
	});
}
var $$splitComponentImporter$4 = () => import("./admin-CI3KKSyE.mjs");
var Route$4 = createFileRoute("/admin")({
	head: () => ({ meta: [
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{ title: "Admin — 8squared Chess Club" },
		{
			name: "description",
			content: "Club management area for 8squared administrators."
		},
		{
			property: "og:title",
			content: "Admin — 8squared Chess Club"
		},
		{
			property: "og:description",
			content: "Club management area for 8squared administrators."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./membership-CMiIbRti.mjs");
var Route$3 = createFileRoute("/membership")({
	head: () => ({ meta: [
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{ title: "Join the club — 8squared Chess Club" },
		{
			name: "description",
			content: "Apply for membership at the 8squared chess club with a short skill survey."
		},
		{
			property: "og:title",
			content: "Join the club — 8squared Chess Club"
		},
		{
			property: "og:description",
			content: "Apply for membership at the 8squared chess club with a short skill survey."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./sponsors-DKdZI_2Y.mjs");
var Route$2 = createFileRoute("/sponsors")({
	head: () => ({ meta: [
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{ title: "Sponsors & partners — 8squared Chess Club" },
		{
			name: "description",
			content: "The sponsors and partners supporting the 8squared chess club."
		},
		{
			property: "og:title",
			content: "Sponsors & partners — 8squared Chess Club"
		},
		{
			property: "og:description",
			content: "The sponsors and partners supporting the 8squared chess club."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./terms-CibFFfm6.mjs");
var Route$1 = createFileRoute("/terms")({
	head: () => ({ meta: [
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		},
		{ title: "Terms & privacy — 8squared Chess Club" },
		{
			name: "description",
			content: "Terms of use and privacy information for the 8squared chess club website."
		},
		{
			property: "og:title",
			content: "Terms & privacy — 8squared Chess Club"
		},
		{
			property: "og:description",
			content: "Terms of use and privacy information for the 8squared chess club website."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./events.index-CERSZQCJ.mjs");
var Route = createFileRoute("/events/")({
	head: () => ({ meta: [
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		},
		{ title: "Events — 8squared Chess Club" },
		{
			name: "description",
			content: "Upcoming tournaments, training sessions and friendly matches at 8squared."
		},
		{
			property: "og:title",
			content: "Events — 8squared Chess Club"
		},
		{
			property: "og:description",
			content: "Upcoming tournaments, training sessions and friendly matches at 8squared."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$5
});
var AdminRoute = Route$4.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$5
});
var MembershipRoute = Route$3.update({
	id: "/membership",
	path: "/membership",
	getParentRoute: () => Route$5
});
var SponsorsRoute = Route$2.update({
	id: "/sponsors",
	path: "/sponsors",
	getParentRoute: () => Route$5
});
var TermsRoute = Route$1.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$5
});
var EventsIndexRoute = Route.update({
	id: "/events/",
	path: "/events/",
	getParentRoute: () => Route$5
});
var rootRouteChildren = {
	IndexRoute,
	AdminRoute,
	MembershipRoute,
	SponsorsRoute,
	TermsRoute,
	EventsEventIdRoute: Route$6.update({
		id: "/events/$eventId",
		path: "/events/$eventId",
		getParentRoute: () => Route$5
	}),
	EventsIndexRoute
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
