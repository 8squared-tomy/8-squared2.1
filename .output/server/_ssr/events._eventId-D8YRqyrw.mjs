import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageProvider-CQ4v6zaN.mjs";
import { c as fetchEventSponsors, m as registerForEvent, o as fetchEventById, p as normalizeEmail, s as fetchEventSeatCounts, v as validateEventRegistration } from "./publicApi-df8cJKU-.mjs";
import { t as useAsyncData } from "./useAsyncData-BRqhOT1q.mjs";
import { A as CalendarDays, M as ArrowLeft, g as MapPin } from "../_libs/lucide-react.mjs";
import { n as Notice, t as FormField } from "./FormField-BAimJ5Nb.mjs";
import { n as getEventState, r as seatsLeft, t as formatDateTime } from "./events-BEcXuI1l.mjs";
import { t as Route } from "./events._eventId-DVquISPW.mjs";
import { n as EventStateBadge } from "./EventCard-C3Cz1VsX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/events._eventId-D8YRqyrw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	firstName: "",
	lastName: "",
	email: "",
	university: "",
	needsAccommodation: false,
	residence: "",
	bacRegistrationNumber: "",
	phone: ""
};
function EventRegistrationForm({ eventId, state, onRegistered }) {
	const { t } = useLanguage();
	const uid = (0, import_react.useId)();
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [serverError, setServerError] = (0, import_react.useState)(null);
	const [result, setResult] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	if (state === "past" || state === "closed") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: t(state === "past" ? "eventPast" : "eventClosed")
	});
	const update = (patch) => setForm((current) => ({
		...current,
		...patch
	}));
	const id = (field) => `${uid}-${field}`;
	const handleSubmit = async (submit) => {
		submit.preventDefault();
		const found = validateEventRegistration(form);
		setErrors(found);
		setServerError(null);
		setResult(null);
		if (Object.keys(found).length > 0) return;
		setSubmitting(true);
		try {
			const response = await registerForEvent({
				eventId,
				fullName: `${form.firstName.trim()} ${form.lastName.trim()}`.trim(),
				email: normalizeEmail(form.email),
				university: form.university.trim(),
				phone: form.phone.trim(),
				needsAccommodation: form.needsAccommodation,
				residence: form.residence.trim(),
				bacRegistrationNumber: form.bacRegistrationNumber.trim()
			});
			if (!response.ok) {
				setServerError(response.errorKey);
				return;
			}
			setResult(response.data);
			setForm(EMPTY);
			onRegistered?.();
		} catch {
			setServerError("errGeneric");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		className: "space-y-4",
		noValidate: true,
		children: [
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "success",
				children: t(result === "confirmed" ? "eventRegisterSuccess" : "eventWaitlistSuccess")
			}),
			serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(serverError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: t("fieldFirstName"),
					htmlFor: id("first"),
					required: true,
					error: errors.firstName && t(errors.firstName),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: id("first"),
						className: "input",
						value: form.firstName,
						onChange: (e) => update({ firstName: e.target.value }),
						autoComplete: "given-name",
						required: true
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: t("fieldLastName"),
					htmlFor: id("last"),
					required: true,
					error: errors.lastName && t(errors.lastName),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: id("last"),
						className: "input",
						value: form.lastName,
						onChange: (e) => update({ lastName: e.target.value }),
						autoComplete: "family-name",
						required: true
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldEmail"),
				htmlFor: id("email"),
				required: true,
				error: errors.email && t(errors.email),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: id("email"),
					type: "email",
					dir: "ltr",
					className: "input",
					value: form.email,
					onChange: (e) => update({ email: e.target.value }),
					autoComplete: "email",
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldUniversity"),
				htmlFor: id("university"),
				required: true,
				error: errors.university && t(errors.university),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: id("university"),
					className: "input",
					value: form.university,
					onChange: (e) => update({ university: e.target.value }),
					required: true
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "field-label",
					children: t("colAccommodation")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: [false, true].map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						"aria-pressed": form.needsAccommodation === value,
						onClick: () => update({ needsAccommodation: value }),
						className: `min-h-11 flex-1 rounded-md border px-3 text-sm font-semibold transition-colors ${form.needsAccommodation === value ? "border-gold bg-gold text-on-gold" : "border-border bg-surface text-ink hover:border-gold"}`,
						children: t(value ? "answerYes" : "answerNo")
					}, String(value)))
				})]
			}),
			form.needsAccommodation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4 rounded-lg border border-border bg-surface-2 p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("fieldResidence"),
						htmlFor: id("residence"),
						required: true,
						error: errors.residence && t(errors.residence),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: id("residence"),
							className: "input",
							value: form.residence,
							onChange: (e) => update({ residence: e.target.value }),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("fieldBacNumber"),
						htmlFor: id("bac"),
						required: true,
						error: errors.bacRegistrationNumber && t(errors.bacRegistrationNumber),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: id("bac"),
							inputMode: "numeric",
							dir: "ltr",
							className: "input",
							value: form.bacRegistrationNumber,
							onChange: (e) => update({ bacRegistrationNumber: e.target.value }),
							required: true
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("fieldPhone"),
						htmlFor: id("phone"),
						required: true,
						error: errors.phone && t(errors.phone),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: id("phone"),
							type: "tel",
							dir: "ltr",
							className: "input",
							value: form.phone,
							onChange: (e) => update({ phone: e.target.value }),
							autoComplete: "tel",
							required: true
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				className: "btn-primary w-full",
				disabled: submitting,
				children: submitting ? t("loading") : t(state === "full" ? "eventWaitlistButton" : "eventRegisterButton")
			})
		]
	});
}
var UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function EventDetailPage({ eventId }) {
	const { t, pick, language } = useLanguage();
	const isValidId = UUID_PATTERN.test(eventId);
	const detail = useAsyncData(async () => {
		if (!isValidId) return null;
		const [event, sponsors, counts] = await Promise.all([
			fetchEventById(eventId),
			fetchEventSponsors(eventId),
			fetchEventSeatCounts()
		]);
		if (!event) return null;
		return {
			event,
			sponsors,
			confirmedCount: counts[eventId] ?? 0
		};
	}, [eventId]);
	const backLink = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: "/events",
		className: "btn-ghost px-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
			className: "h-4 w-4 rtl:rotate-180",
			"aria-hidden": "true"
		}), t("backToEvents")]
	});
	if (detail.loading && !detail.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-4xl px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: t("loading")
		})
	});
	if (detail.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl space-y-6 px-4 py-16 sm:px-6",
		children: [backLink, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
			tone: "error",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: detail.reload,
				className: "btn-ghost mt-2 px-0 text-danger",
				children: t("retry")
			})]
		})]
	});
	if (!detail.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-4xl space-y-6 px-4 py-16 sm:px-6",
		children: [
			backLink,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl",
				children: t("eventNotFoundTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("eventNotFoundBody")
			})
		]
	});
	const { event, sponsors, confirmedCount } = detail.data;
	const state = getEventState(event, confirmedCount);
	const title = pick(event.title_en, event.title_ar);
	const description = pick(event.description_en, event.description_ar);
	const location = pick(event.location_en, event.location_ar);
	const seats = seatsLeft(event, confirmedCount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16",
		children: [backLink, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "space-y-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventStateBadge, {
								state,
								seats
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-4xl",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "space-y-3 text-lg text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
										className: "h-5 w-5 shrink-0 text-gold",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatDateTime(event.starts_at, language) })]
								}), location && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, {
										className: "h-5 w-5 shrink-0 text-gold",
										"aria-hidden": "true"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: location })]
								})]
							})
						]
					}),
					description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "whitespace-pre-line text-lg leading-relaxed text-muted",
						children: description
					}),
					sponsors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 border-t border-border pt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: t("eventSponsorsTitle")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "flex flex-wrap gap-3",
							children: sponsors.map((sponsor) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium",
								children: sponsor.name
							}, sponsor.id))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "card space-y-6 lg:sticky lg:top-28",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl",
						children: t("registerTitle")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("registerIntro")
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventRegistrationForm, {
					eventId: event.id,
					state,
					onRegistered: detail.reload
				}, event.id)]
			})]
		})]
	});
}
function EventRoute() {
	const { eventId } = Route.useParams();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventDetailPage, { eventId });
}
//#endregion
export { EventRoute as component };
