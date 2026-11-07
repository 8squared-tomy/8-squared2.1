import { n as __toESM } from "../_runtime.mjs";
import { U as isRedirect, b as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as createServerFn } from "./createServerFn-DDDJMFWM.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-bot2Ewvl.mjs";
import { n as object, r as string } from "../_libs/zod.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BEg5oiP4.mjs";
import { n as useLanguage } from "./LanguageProvider-CQ4v6zaN.mjs";
import { _ as supabase, d as isSafeHttpsUrl, f as isValidEmail, h as resetSiteContentCache, p as normalizeEmail, u as fetchSiteContent } from "./publicApi-df8cJKU-.mjs";
import { t as useAsyncData } from "./useAsyncData-BRqhOT1q.mjs";
import { t as createSsrRpc } from "./createSsrRpc-MUowDJDk.mjs";
import { M as ArrowLeft, T as Download, _ as Mail, a as Trash2, f as Phone, l as Save, n as Users, p as Pencil, s as Settings, u as Plus, v as LogOut, y as Lock } from "../_libs/lucide-react.mjs";
import { t as Modal } from "./Modal-3BmmUOJB.mjs";
import { n as Notice, t as FormField } from "./FormField-BAimJ5Nb.mjs";
import { t as formatDateTime } from "./events-BEcXuI1l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-CI3KKSyE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var unlockEditor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(object({
	email: string().email(),
	password: string().min(1).max(256)
})).handler(createSsrRpc("494dd2083725c6ed9f2c918f56f17ada84ee4bbecf6d6f4a1d4edce5296b5adf"));
var lockEditor = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).handler(createSsrRpc("758f17c5228781d6c5e734dcadd18ba30fd83d4ea2f8d3737f6a4cbf947f9627"));
async function signInAdmin(email, password) {
	const { error } = await supabase.auth.signInWithPassword({
		email: email.trim().toLowerCase(),
		password
	});
	if (error) throw error;
}
async function signOutAdmin() {
	const { error } = await supabase.auth.signOut();
	if (error) throw error;
}
async function getCurrentSession() {
	const { data, error } = await supabase.auth.getSession();
	if (error) throw error;
	return data.session;
}
async function verifyAdminPassword(password) {
	const session = await getCurrentSession();
	if (!session?.user.email) return false;
	return (await unlockEditor({ data: {
		email: session.user.email,
		password
	} })).ok === true;
}
async function updateAdminCredentials(attributes) {
	const { error } = await supabase.auth.updateUser(attributes);
	if (error) throw error;
}
async function isCurrentUserAdmin() {
	const { data, error } = await supabase.rpc("can_read_admin");
	if (error) throw error;
	return data === true;
}
function AdminLogin({ onSignedIn }) {
	const { t } = useLanguage();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [failed, setFailed] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!isValidEmail(email) || password.length === 0) {
			setFailed(true);
			return;
		}
		setSubmitting(true);
		setFailed(false);
		try {
			await signInAdmin(email, password);
			setPassword("");
			onSignedIn();
		} catch {
			setFailed(true);
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-md px-4 py-16 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: t("adminTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-4xl",
				children: t("adminLoginTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted",
				children: t("adminLoginIntro")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				noValidate: true,
				className: "card mt-10 space-y-6",
				children: [
					failed && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
						tone: "error",
						children: t("adminLoginError")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "admin-email",
							className: "field-label",
							children: t("fieldEmail")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "admin-email",
							type: "email",
							autoComplete: "username",
							dir: "ltr",
							className: "input",
							value: email,
							onChange: (event) => setEmail(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "admin-password",
							className: "field-label",
							children: t("adminPassword")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "admin-password",
							type: "password",
							autoComplete: "current-password",
							dir: "ltr",
							className: "input",
							value: password,
							onChange: (event) => setPassword(event.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary w-full",
						disabled: submitting,
						children: submitting ? t("adminSigningIn") : t("adminSignIn")
					})
				]
			})
		]
	});
}
var MIN_PASSWORD_LENGTH = 8;
function AccountPanel() {
	const { t } = useLanguage();
	const [currentEmail, setCurrentEmail] = (0, import_react.useState)("");
	const [currentPassword, setCurrentPassword] = (0, import_react.useState)("");
	const [newEmail, setNewEmail] = (0, import_react.useState)("");
	const [newPassword, setNewPassword] = (0, import_react.useState)("");
	const [confirmPassword, setConfirmPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const [success, setSuccess] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		getCurrentSession().then((session) => setCurrentEmail(session?.user.email ?? "")).catch(() => setCurrentEmail(""));
	}, []);
	const handleSubmit = async (event) => {
		event.preventDefault();
		setSuccess(null);
		const email = normalizeEmail(newEmail);
		const wantsEmail = email.length > 0;
		const wantsPassword = newPassword.length > 0;
		if (!wantsEmail && !wantsPassword) {
			setError("accountNothingToChange");
			return;
		}
		if (wantsEmail && !isValidEmail(email)) {
			setError("errEmail");
			return;
		}
		if (wantsPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
			setError("accountPasswordShort");
			return;
		}
		if (wantsPassword && newPassword !== confirmPassword) {
			setError("accountPasswordMismatch");
			return;
		}
		setSaving(true);
		setError(null);
		try {
			if (!currentPassword) {
				setError("errRequired");
				return;
			}
			if (!await verifyAdminPassword(currentPassword)) {
				setError("accountWrongPassword");
				return;
			}
			await updateAdminCredentials({
				...wantsEmail ? { email } : {},
				...wantsPassword ? { password: newPassword } : {},
				...wantsPassword ? { current_password: currentPassword } : {}
			});
			setSuccess({ emailChanged: wantsEmail });
			setCurrentPassword("");
			setNewEmail("");
			setNewPassword("");
			setConfirmPassword("");
		} catch {
			setError("adminActionError");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted",
			children: t("accountIntro")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			className: "card space-y-6",
			children: [
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
					tone: "error",
					children: t(error)
				}),
				success && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
					tone: "success",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("accountUpdated") }), success.emailChanged && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: t("accountEmailConfirmHint")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "account-current-password",
						className: "field-label",
						children: t("accountCurrentPassword")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "account-current-password",
						type: "password",
						autoComplete: "current-password",
						dir: "ltr",
						className: "input",
						value: currentPassword,
						onChange: (event) => setCurrentPassword(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "account-new-email",
							className: "field-label",
							children: t("accountNewEmail")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "account-new-email",
							type: "email",
							autoComplete: "email",
							dir: "ltr",
							placeholder: currentEmail,
							className: "input",
							value: newEmail,
							onChange: (event) => setNewEmail(event.target.value)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "account-new-password",
							className: "field-label",
							children: t("accountNewPassword")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "account-new-password",
							type: "password",
							autoComplete: "new-password",
							dir: "ltr",
							className: "input",
							value: newPassword,
							onChange: (event) => setNewPassword(event.target.value)
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "account-confirm-password",
						className: "field-label",
						children: t("accountConfirmPassword")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "account-confirm-password",
						type: "password",
						autoComplete: "new-password",
						dir: "ltr",
						className: "input",
						value: confirmPassword,
						onChange: (event) => setConfirmPassword(event.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary",
						disabled: saving,
						children: saving ? t("accountUpdating") : t("accountUpdate")
					})
				})
			]
		})]
	});
}
async function saveSiteContent(key, valueEn, valueAr) {
	const { data, error } = await supabase.from("site_content").update({
		value_en: valueEn,
		value_ar: valueAr
	}).eq("key", key).select("key");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Update was not applied");
	resetSiteContentCache();
}
var LABELS = {
	hero_title: "contentHeroTitle",
	hero_subtitle: "contentHeroSubtitle",
	about_text: "contentAbout"
};
function ContentPanel() {
	const { t, language } = useLanguage();
	const content = useAsyncData(() => fetchSiteContent(), []);
	const [drafts, setDrafts] = (0, import_react.useState)({});
	const [savingKey, setSavingKey] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)(null);
	const rows = content.data ?? [];
	const draftFor = (entry) => drafts[entry.key] ?? {
		valueEn: entry.value_en,
		valueAr: entry.value_ar
	};
	const update = (entry, patch) => setDrafts((current) => ({
		...current,
		[entry.key]: {
			...draftFor(entry),
			...patch
		}
	}));
	const handleSave = async (entry, submit) => {
		submit.preventDefault();
		const draft = draftFor(entry);
		setSavingKey(entry.key);
		setStatus(null);
		try {
			await saveSiteContent(entry.key, draft.valueEn.trim(), draft.valueAr.trim());
			setDrafts((current) => {
				const next = { ...current };
				delete next[entry.key];
				return next;
			});
			setStatus({
				key: entry.key,
				tone: "success"
			});
			content.reload();
		} catch {
			setStatus({
				key: entry.key,
				tone: "error"
			});
		} finally {
			setSavingKey(null);
		}
	};
	if (content.loading && !content.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: t("loading")
	});
	if (content.error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
		tone: "error",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: content.reload,
			className: "btn-ghost mt-2 px-0 text-danger",
			children: t("retry")
		})]
	});
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: t("adminNoRows")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: t("contentSaveHint")
		}), rows.map((entry) => {
			const draft = draftFor(entry);
			const dirty = drafts[entry.key] !== void 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (submit) => handleSave(entry, submit),
				className: "card space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg",
							children: LABELS[entry.key] ? t(LABELS[entry.key]) : entry.key
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "text-xs text-muted",
							children: entry.key
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: `content-${entry.key}-en`,
								className: "field-label",
								children: t("contentEnglish")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: `content-${entry.key}-en`,
								dir: "ltr",
								rows: 4,
								className: "input",
								value: draft.valueEn,
								onChange: (e) => update(entry, { valueEn: e.target.value })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: `content-${entry.key}-ar`,
								className: "field-label",
								children: t("contentArabic")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: `content-${entry.key}-ar`,
								dir: "rtl",
								rows: 4,
								className: "input",
								value: draft.valueAr,
								onChange: (e) => update(entry, { valueAr: e.target.value })
							})]
						})]
					}),
					status?.key === entry.key && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
						tone: status.tone === "success" ? "success" : "error",
						children: t(status.tone === "success" ? "adminSaved" : "adminActionError")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary",
						disabled: !dirty || savingKey === entry.key,
						children: savingKey === entry.key ? t("adminSaving") : t("adminSave")
					})
				]
			}, entry.key);
		})]
	});
}
var optional = (value) => value.trim() ? value.trim() : null;
function toEventRow(draft) {
	const capacity = draft.capacity.trim();
	return {
		title_en: draft.titleEn.trim(),
		title_ar: optional(draft.titleAr),
		description_en: optional(draft.descriptionEn),
		description_ar: optional(draft.descriptionAr),
		location_en: optional(draft.locationEn),
		location_ar: optional(draft.locationAr),
		starts_at: new Date(draft.startsAt).toISOString(),
		ends_at: draft.endsAt ? new Date(draft.endsAt).toISOString() : null,
		capacity: capacity ? Number(capacity) : null,
		status: draft.status,
		registration_open: draft.registrationOpen
	};
}
async function listAdminEvents() {
	const { data, error } = await supabase.from("events").select("*").order("starts_at", { ascending: false }).limit(500);
	if (error) throw error;
	return data ?? [];
}
async function saveEvent(draft, id) {
	const row = toEventRow(draft);
	if (id) {
		const { data, error } = await supabase.from("events").update(row).eq("id", id).select("id");
		if (error) throw error;
		if (!data || data.length === 0) throw new Error("Update was not applied");
		return id;
	}
	const { data, error } = await supabase.from("events").insert(row).select("id").single();
	if (error) throw error;
	return data.id;
}
async function deleteEvent(id) {
	const { data, error } = await supabase.from("events").delete().eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Delete was not applied");
}
async function listEventSponsorIds(eventId) {
	const { data, error } = await supabase.from("event_sponsors").select("sponsor_id").eq("event_id", eventId);
	if (error) throw error;
	return (data ?? []).map((row) => row.sponsor_id);
}
async function setEventSponsorIds(eventId, sponsorIds) {
	const { error: deleteError } = await supabase.from("event_sponsors").delete().eq("event_id", eventId);
	if (deleteError) throw deleteError;
	if (sponsorIds.length === 0) return;
	const { error } = await supabase.from("event_sponsors").insert(sponsorIds.map((sponsorId) => ({
		event_id: eventId,
		sponsor_id: sponsorId
	})));
	if (error) throw error;
}
async function listAdminSponsors() {
	const { data, error } = await supabase.from("sponsors").select("*").order("sort_order", { ascending: true }).limit(500);
	if (error) throw error;
	return data ?? [];
}
async function saveSponsor(draft, id) {
	const row = {
		name: draft.name.trim(),
		description_en: optional(draft.descriptionEn),
		description_ar: optional(draft.descriptionAr),
		logo_url: optional(draft.logoUrl),
		website_url: optional(draft.websiteUrl),
		sort_order: draft.sortOrder,
		is_active: draft.isActive
	};
	if (id) {
		const { data, error } = await supabase.from("sponsors").update(row).eq("id", id).select("id");
		if (error) throw error;
		if (!data || data.length === 0) throw new Error("Update was not applied");
		return;
	}
	const { error } = await supabase.from("sponsors").insert(row);
	if (error) throw error;
}
async function deleteSponsor(id) {
	const { data, error } = await supabase.from("sponsors").delete().eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Delete was not applied");
}
async function listAdminLinks() {
	const { data, error } = await supabase.from("external_links").select("*").order("sort_order", { ascending: true }).limit(500);
	if (error) throw error;
	return data ?? [];
}
async function saveLink(draft, id) {
	const row = {
		label_en: draft.labelEn.trim(),
		label_ar: optional(draft.labelAr),
		url: draft.url.trim(),
		sort_order: draft.sortOrder,
		is_active: draft.isActive
	};
	if (id) {
		const { data, error } = await supabase.from("external_links").update(row).eq("id", id).select("id");
		if (error) throw error;
		if (!data || data.length === 0) throw new Error("Update was not applied");
		return;
	}
	const { error } = await supabase.from("external_links").insert(row);
	if (error) throw error;
}
async function deleteLink(id) {
	const { data, error } = await supabase.from("external_links").delete().eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Delete was not applied");
}
var MAX_TEXT = 3e3;
function toLocalInput(iso) {
	if (!iso) return "";
	const date = new Date(iso);
	return (/* @__PURE__ */ new Date(date.getTime() - date.getTimezoneOffset() * 6e4)).toISOString().slice(0, 16);
}
function emptyDraft() {
	return {
		titleEn: "",
		titleAr: "",
		descriptionEn: "",
		descriptionAr: "",
		locationEn: "",
		locationAr: "",
		startsAt: "",
		endsAt: "",
		capacity: "",
		status: "draft",
		registrationOpen: false
	};
}
function draftFrom$1(event) {
	return {
		titleEn: event.title_en,
		titleAr: event.title_ar ?? "",
		descriptionEn: event.description_en ?? "",
		descriptionAr: event.description_ar ?? "",
		locationEn: event.location_en ?? "",
		locationAr: event.location_ar ?? "",
		startsAt: toLocalInput(event.starts_at),
		endsAt: toLocalInput(event.ends_at),
		capacity: event.capacity?.toString() ?? "",
		status: event.status,
		registrationOpen: event.registration_open
	};
}
function validateDraft(draft) {
	const errors = {};
	const title = draft.titleEn.trim();
	if (title.length < 2 || title.length > 150) errors.titleEn = "eventErrTitle";
	if (draft.titleAr.length > 150) errors.titleAr = "eventErrTitle";
	if (draft.descriptionEn.length > MAX_TEXT) errors.descriptionEn = "errTooLong";
	if (draft.descriptionAr.length > MAX_TEXT) errors.descriptionAr = "errTooLong";
	if (draft.locationEn.length > 200) errors.locationEn = "errTooLong";
	if (draft.locationAr.length > 200) errors.locationAr = "errTooLong";
	const starts = new Date(draft.startsAt).getTime();
	if (!draft.startsAt || Number.isNaN(starts)) errors.startsAt = "eventErrStart";
	if (draft.endsAt) {
		const ends = new Date(draft.endsAt).getTime();
		if (Number.isNaN(ends) || !Number.isNaN(starts) && ends < starts) errors.endsAt = "eventErrEnd";
	}
	const capacity = draft.capacity.trim();
	if (capacity && !(/^\d+$/.test(capacity) && Number(capacity) >= 1 && Number(capacity) <= 1e4)) errors.capacity = "eventErrCapacity";
	return errors;
}
function EventEditor({ event, onClose, onSaved }) {
	const { t } = useLanguage();
	const editing = useAsyncData(async () => {
		const [sponsors, sponsorIds] = await Promise.all([listAdminSponsors(), event ? listEventSponsorIds(event.id) : Promise.resolve([])]);
		return {
			sponsors,
			sponsorIds
		};
	}, [event?.id]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Modal, {
		title: t(event ? "eventsAdminEdit" : "eventsAdminNew"),
		onClose,
		children: [
			editing.loading && !editing.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("loading")
			}),
			editing.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: editing.reload,
					className: "btn-ghost mt-2 px-0 text-danger",
					children: t("retry")
				})]
			}),
			editing.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventForm, {
				initialDraft: event ? draftFrom$1(event) : emptyDraft(),
				initialEventId: event?.id ?? null,
				initialSponsorIds: editing.data.sponsorIds,
				sponsors: editing.data.sponsors,
				onClose,
				onSaved
			})
		]
	});
}
function EventForm({ initialDraft, initialEventId, initialSponsorIds, sponsors, onClose, onSaved }) {
	const { t } = useLanguage();
	const [draft, setDraft] = (0, import_react.useState)(initialDraft);
	const [sponsorIds, setSponsorIds] = (0, import_react.useState)(initialSponsorIds);
	const [eventId, setEventId] = (0, import_react.useState)(initialEventId);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const set = (key, value) => {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
		setErrors((current) => ({
			...current,
			[key]: void 0
		}));
	};
	const toggleSponsor = (id) => {
		setSponsorIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const found = validateDraft(draft);
		setErrors(found);
		if (Object.keys(found).length > 0) return;
		setSaving(true);
		setSaveError(null);
		try {
			const savedId = await saveEvent(draft, eventId);
			setEventId(savedId);
			await setEventSponsorIds(savedId, sponsorIds);
			onSaved();
		} catch {
			setSaveError(eventId ? "adminActionError" : "eventSaveError");
		} finally {
			setSaving(false);
		}
	};
	const textField = (key, labelKey, multiline = false, required = false) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
		label: t(labelKey),
		htmlFor: `event-${key}`,
		required,
		error: errors[key] && t(errors[key]),
		children: multiline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			id: `event-${key}`,
			rows: 4,
			className: "input",
			value: draft[key],
			onChange: (e) => set(key, e.target.value),
			"aria-invalid": Boolean(errors[key])
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			id: `event-${key}`,
			className: "input",
			value: draft[key],
			onChange: (e) => set(key, e.target.value),
			"aria-invalid": Boolean(errors[key])
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		noValidate: true,
		className: "space-y-6",
		children: [
			saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(saveError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 sm:grid-cols-2",
				children: [
					textField("titleEn", "eventFieldTitleEn", false, true),
					textField("titleAr", "eventFieldTitleAr"),
					textField("locationEn", "eventFieldLocEn"),
					textField("locationAr", "eventFieldLocAr"),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("eventFieldStarts"),
						htmlFor: "event-startsAt",
						required: true,
						error: errors.startsAt && t(errors.startsAt),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "event-startsAt",
							type: "datetime-local",
							className: "input",
							value: draft.startsAt,
							onChange: (e) => set("startsAt", e.target.value),
							"aria-invalid": Boolean(errors.startsAt)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("eventFieldEnds"),
						htmlFor: "event-endsAt",
						error: errors.endsAt && t(errors.endsAt),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "event-endsAt",
							type: "datetime-local",
							className: "input",
							value: draft.endsAt,
							onChange: (e) => set("endsAt", e.target.value),
							"aria-invalid": Boolean(errors.endsAt)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("eventFieldCapacity"),
						htmlFor: "event-capacity",
						error: errors.capacity && t(errors.capacity),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "event-capacity",
							inputMode: "numeric",
							dir: "ltr",
							className: "input",
							value: draft.capacity,
							onChange: (e) => set("capacity", e.target.value),
							"aria-invalid": Boolean(errors.capacity)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
						label: t("eventFieldStatus"),
						htmlFor: "event-status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "event-status",
							className: "input",
							value: draft.status,
							onChange: (e) => set("status", e.target.value),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "draft",
									children: t("eventStatusDraft")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "published",
									children: t("eventStatusPublished")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "archived",
									children: t("eventStatusArchived")
								})
							]
						})
					})
				]
			}),
			textField("descriptionEn", "eventFieldDescEn", true),
			textField("descriptionAr", "eventFieldDescAr", true),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex min-h-11 items-center gap-3 text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					className: "h-5 w-5 accent-[rgb(var(--c-gold))]",
					checked: draft.registrationOpen,
					onChange: (e) => set("registrationOpen", e.target.checked)
				}), t("eventFieldRegOpen")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "field-label",
						children: t("eventSponsorsLabel")
					}),
					sponsors.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: t("sponsorsAdminNone")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: sponsors.map((sponsor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex min-h-11 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "checkbox",
								className: "h-5 w-5 accent-[rgb(var(--c-gold))]",
								checked: sponsorIds.includes(sponsor.id),
								onChange: () => toggleSponsor(sponsor.id)
							}), sponsor.name]
						}, sponsor.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "btn-secondary",
					onClick: onClose,
					children: t("adminCancel")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "btn-primary",
					disabled: saving,
					children: saving ? t("adminSaving") : t("adminSave")
				})]
			})
		]
	});
}
var EXPORT_LIMIT = 5e3;
function sanitizeSearch(value) {
	return value.replace(/[^\p{L}\p{N}\s@._-]/gu, "").trim().slice(0, 100);
}
async function listMembershipRequests({ page, search, status }) {
	const from = page * 25;
	let query = supabase.from("membership_requests").select("*", { count: "exact" }).order("created_at", { ascending: false }).range(from, from + 25 - 1);
	if (status !== "all") query = query.eq("status", status);
	const term = sanitizeSearch(search);
	if (term) query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
	const { data, error, count } = await query;
	if (error) throw error;
	return {
		rows: data ?? [],
		total: count ?? 0
	};
}
async function exportMembershipRequests() {
	const { data, error } = await supabase.from("membership_requests").select("*").order("created_at", { ascending: false }).limit(EXPORT_LIMIT);
	if (error) throw error;
	return data ?? [];
}
async function updateMembershipStatus(id, status) {
	const { data, error } = await supabase.from("membership_requests").update({ status }).eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Update was not applied");
}
async function deleteMembershipRequest(id) {
	const { data, error } = await supabase.from("membership_requests").delete().eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Delete was not applied");
}
async function listRegistrations({ eventId, page, search, status }) {
	const from = page * 25;
	let query = supabase.from("event_registrations").select("*", { count: "exact" }).eq("event_id", eventId).order("created_at", { ascending: true }).range(from, from + 25 - 1);
	if (status !== "all") query = query.eq("status", status);
	const term = sanitizeSearch(search);
	if (term) query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
	const { data, error, count } = await query;
	if (error) throw error;
	return {
		rows: data ?? [],
		total: count ?? 0
	};
}
async function exportRegistrations(eventId) {
	const { data, error } = await supabase.from("event_registrations").select("*").eq("event_id", eventId).order("created_at", { ascending: true }).limit(EXPORT_LIMIT);
	if (error) throw error;
	return data ?? [];
}
async function countConfirmedRegistrations(eventId) {
	const { count, error } = await supabase.from("event_registrations").select("id", {
		count: "exact",
		head: true
	}).eq("event_id", eventId).eq("status", "confirmed");
	if (error) throw error;
	return count ?? 0;
}
async function updateRegistrationStatus(id, status) {
	const { data, error } = await supabase.from("event_registrations").update({ status }).eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Update was not applied");
}
async function deleteRegistration(id) {
	const { data, error } = await supabase.from("event_registrations").delete().eq("id", id).select("id");
	if (error) throw error;
	if (!data || data.length === 0) throw new Error("Delete was not applied");
}
function AdminPager({ page, total, onPage }) {
	const { t } = useLanguage();
	const pages = Math.max(1, Math.ceil(total / 25));
	if (pages <= 1) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "flex flex-wrap items-center justify-between gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-secondary",
				onClick: () => onPage(page - 1),
				disabled: page <= 0,
				children: t("adminPrevious")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					t("adminPageOf", {
						page: page + 1,
						total: pages
					}),
					" · ",
					t("adminRowsTotal", { n: total })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "btn-secondary",
				onClick: () => onPage(page + 1),
				disabled: page >= pages - 1,
				children: t("adminNext")
			})
		]
	});
}
function needsFormulaPrefix(text) {
	if (/^[=+@\t\r]/.test(text)) return true;
	return /^-/.test(text) && !/^-\d+(\.\d+)?$/.test(text);
}
function escapeCell(value) {
	let text = value === null || value === void 0 ? "" : String(value);
	if (needsFormulaPrefix(text)) text = `'${text}`;
	return `"${text.replace(/"/g, "\"\"")}"`;
}
function buildCsv(rows, columns) {
	return [columns.map((column) => escapeCell(column.header)).join(","), ...rows.map((row) => columns.map((column) => escapeCell(column.value(row))).join(","))].join("\r\n");
}
function downloadCsv(filename, content) {
	const blob = new Blob(["﻿", content], { type: "text/csv;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
var LEVEL_KEYS = {
	beginner: "levelBeginner",
	intermediate: "levelIntermediate",
	advanced: "levelAdvanced",
	expert: "levelExpert"
};
var YEARS_KEYS = {
	under_1: "yearsUnder1",
	"1_3": "years1to3",
	"3_5": "years3to5",
	over_5: "yearsOver5"
};
var MEMBERSHIP_STATUS_KEYS = {
	new: "statusNew",
	accepted: "statusAccepted",
	rejected: "statusRejected",
	waitlisted: "statusWaitlisted"
};
var REGISTRATION_STATUS_KEYS = {
	confirmed: "statusConfirmed",
	waitlisted: "statusWaitlisted",
	cancelled: "statusCancelled"
};
var EVENT_STATUS_KEYS = {
	draft: "eventStatusDraft",
	published: "eventStatusPublished",
	archived: "eventStatusArchived"
};
var STATUSES$1 = [
	"confirmed",
	"waitlisted",
	"cancelled"
];
function RegistrationsPanel({ event, onBack, readOnly = false }) {
	const { t, language } = useLanguage();
	const [page, setPage] = (0, import_react.useState)(0);
	const [search, setSearch] = (0, import_react.useState)("");
	const [draftSearch, setDraftSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const list = useAsyncData(() => listRegistrations({
		eventId: event.id,
		page,
		search,
		status
	}), [
		event.id,
		page,
		search,
		status
	]);
	const confirmed = useAsyncData(() => countConfirmedRegistrations(event.id), [event.id]);
	const refresh = () => {
		list.reload();
		confirmed.reload();
	};
	const handleSearch = (submit) => {
		submit.preventDefault();
		setPage(0);
		setSearch(draftSearch);
	};
	const handleStatusChange = async (row, next) => {
		setBusyId(row.id);
		setActionError(null);
		try {
			await updateRegistrationStatus(row.id, next);
			refresh();
		} catch {
			setActionError("adminActionError");
		} finally {
			setBusyId(null);
		}
	};
	const handleDelete = async (row) => {
		if (!window.confirm(t("adminDeleteConfirm"))) return;
		setBusyId(row.id);
		setActionError(null);
		try {
			await deleteRegistration(row.id);
			refresh();
		} catch {
			setActionError("adminActionError");
		} finally {
			setBusyId(null);
		}
	};
	const handleExport = async () => {
		setExporting(true);
		setActionError(null);
		try {
			const csv = buildCsv(await exportRegistrations(event.id), [
				{
					header: t("colName"),
					value: (row) => row.full_name
				},
				{
					header: t("colEmail"),
					value: (row) => row.email
				},
				{
					header: t("colUniversity"),
					value: (row) => row.university
				},
				{
					header: t("colAccommodation"),
					value: (row) => row.needs_accommodation ? t("answerYes") : t("answerNo")
				},
				{
					header: t("fieldResidence"),
					value: (row) => row.needs_accommodation ? row.residence : "—"
				},
				{
					header: t("fieldBacNumber"),
					value: (row) => row.needs_accommodation ? row.bac_registration_number : "—"
				},
				{
					header: t("colPhone"),
					value: (row) => row.needs_accommodation ? row.phone : "—"
				},
				{
					header: t("colStatus"),
					value: (row) => t(REGISTRATION_STATUS_KEYS[row.status])
				},
				{
					header: t("colDate"),
					value: (row) => row.created_at
				}
			]);
			downloadCsv(`8squared-${event.title_en.replace(/[^\p{L}\p{N}]+/gu, "-").slice(0, 40) || "event"}-registrations.csv`, csv);
		} catch {
			setActionError("adminActionError");
		} finally {
			setExporting(false);
		}
	};
	const rows = list.data?.rows ?? [];
	const total = list.data?.total ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: onBack,
				className: "btn-ghost px-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
					className: "h-4 w-4 rtl:rotate-180",
					"aria-hidden": "true"
				}), t("eventsAdminBackToList")]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: t("eventsAdminRegistrations")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: event.title_en
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: confirmed.data !== null && event.capacity !== null ? `${confirmed.data} / ${event.capacity} ${t("statusConfirmed")}` : confirmed.data !== null ? `${confirmed.data} ${t("statusConfirmed")}` : ""
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleExport,
					disabled: exporting,
					className: "btn-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), exporting ? t("adminExporting") : t("adminExportCsv")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSearch,
				role: "search",
				className: "flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "registration-search",
							className: "field-label",
							children: t("adminSearch")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "registration-search",
							type: "search",
							className: "input",
							placeholder: t("searchPlaceholder"),
							value: draftSearch,
							onChange: (e) => setDraftSearch(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "registration-status",
							className: "field-label",
							children: t("adminFilterStatus")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "registration-status",
							className: "input",
							value: status,
							onChange: (e) => {
								setPage(0);
								setStatus(e.target.value);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: t("filterAllStatuses")
							}), STATUSES$1.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: t(REGISTRATION_STATUS_KEYS[value])
							}, value))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-secondary",
						children: t("adminSearchButton")
					})
				]
			}),
			actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(actionError)
			}),
			list.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: list.reload,
					className: "btn-ghost mt-2 px-0 text-danger",
					children: t("retry")
				})]
			}),
			list.loading && !list.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("loading")
			}),
			list.data && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("adminNoRows")
			}),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[1100px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colUniversity")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colAccommodation")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("fieldResidence")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("fieldBacNumber")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colPhone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colStatus")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colDate")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-end font-semibold",
								children: t("adminActions")
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-surface-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-ink",
										children: row.full_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										dir: "ltr",
										className: "text-muted",
										children: row.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.university
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.needs_accommodation ? t("answerYes") : t("answerNo")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.needs_accommodation ? row.residence : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									dir: "ltr",
									className: "px-4 py-3 text-start",
									children: row.needs_accommodation ? row.bac_registration_number : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									dir: "ltr",
									className: "px-4 py-3 text-start",
									children: row.needs_accommodation ? row.phone : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: `reg-status-${row.id}`,
										children: t("colStatus")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: `reg-status-${row.id}`,
										className: "input min-h-10 py-1",
										value: row.status,
										disabled: readOnly || busyId === row.id,
										onChange: (e) => handleStatusChange(row, e.target.value),
										children: STATUSES$1.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value,
											children: t(REGISTRATION_STATUS_KEYS[value])
										}, value))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: new Date(row.created_at).toLocaleDateString(language === "ar" ? "ar" : "en-GB")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end",
									children: !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn-ghost min-h-10 px-3 text-danger",
										disabled: busyId === row.id,
										onClick: () => handleDelete(row),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}),
											t("adminDelete"),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "sr-only",
												children: [": ", row.full_name]
											})
										]
									})
								})
							]
						}, row.id))
					})]
				})
			}),
			total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPager, {
				page,
				total,
				onPage: setPage
			})
		]
	});
}
function EventsPanel({ readOnly = false }) {
	const { t, language, pick } = useLanguage();
	const events = useAsyncData(() => listAdminEvents(), []);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [registrationsFor, setRegistrationsFor] = (0, import_react.useState)(null);
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	if (registrationsFor) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegistrationsPanel, {
		event: registrationsFor,
		readOnly,
		onBack: () => {
			setRegistrationsFor(null);
			events.reload();
		}
	});
	const handleDelete = async (event) => {
		if (!window.confirm(t("adminDeleteConfirm"))) return;
		setBusyId(event.id);
		setActionError(null);
		try {
			await deleteEvent(event.id);
			events.reload();
		} catch {
			setActionError("adminActionError");
		} finally {
			setBusyId(null);
		}
	};
	const rows = events.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: t("adminTabEvents")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: t("eventsTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: t("adminRowsTotal", { n: rows.length })
						})
					]
				}), !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "btn-primary",
					onClick: () => setCreating(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), t("eventsAdminNew")]
				})]
			}),
			actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(actionError)
			}),
			events.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: events.reload,
					className: "btn-ghost mt-2 px-0 text-danger",
					children: t("retry")
				})]
			}),
			events.loading && !events.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("loading")
			}),
			events.data && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("eventsAdminNone")
			}),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-3",
				children: rows.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "card flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg",
										children: pick(event.title_en, event.title_ar)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-border px-2 py-0.5 text-xs font-semibold text-muted",
										children: t(EVENT_STATUS_KEYS[event.status])
									}),
									event.registration_open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full border border-success px-2 py-0.5 text-xs font-semibold text-success",
										children: t("registrationOpen")
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: formatDateTime(event.starts_at, language)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: [
									t("eventCapacity"),
									": ",
									event.capacity ?? t("eventUnlimited")
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-secondary",
							onClick: () => setRegistrationsFor(event),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							}), t("eventsAdminViewRegistrations")]
						}), !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-secondary",
							onClick: () => setEditing(event),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							}), t("adminEdit")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-ghost text-danger",
							disabled: busyId === event.id,
							onClick: () => handleDelete(event),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							}), t("adminDelete")]
						})] })]
					})]
				}, event.id))
			}),
			(creating || editing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventEditor, {
				event: editing,
				onClose: () => {
					setCreating(false);
					setEditing(null);
				},
				onSaved: () => {
					setCreating(false);
					setEditing(null);
					events.reload();
				}
			})
		]
	});
}
var STATUSES = [
	"new",
	"accepted",
	"waitlisted",
	"rejected"
];
var TRAINING_KEYS = {
	weekday_evenings: "trainingWeekdayEvenings",
	weekends: "trainingWeekends",
	flexible: "trainingFlexible"
};
function MembershipsPanel({ readOnly = false }) {
	const { t, language } = useLanguage();
	const [page, setPage] = (0, import_react.useState)(0);
	const [search, setSearch] = (0, import_react.useState)("");
	const [draftSearch, setDraftSearch] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const [busyId, setBusyId] = (0, import_react.useState)(null);
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const list = useAsyncData(() => listMembershipRequests({
		page,
		search,
		status
	}), [
		page,
		search,
		status
	]);
	const handleSearch = (submit) => {
		submit.preventDefault();
		setPage(0);
		setSearch(draftSearch);
	};
	const handleStatusChange = async (row, next) => {
		setBusyId(row.id);
		setActionError(null);
		try {
			await updateMembershipStatus(row.id, next);
			list.reload();
		} catch {
			setActionError("adminActionError");
		} finally {
			setBusyId(null);
		}
	};
	const handleDelete = async (row) => {
		if (!window.confirm(t("adminDeleteConfirm"))) return;
		setBusyId(row.id);
		setActionError(null);
		try {
			await deleteMembershipRequest(row.id);
			list.reload();
		} catch {
			setActionError("adminActionError");
		} finally {
			setBusyId(null);
		}
	};
	const handleExport = async () => {
		setExporting(true);
		setActionError(null);
		try {
			downloadCsv("8squared-membership-requests.csv", buildCsv(await exportMembershipRequests(), [
				{
					header: t("colName"),
					value: (row) => row.full_name
				},
				{
					header: t("colEmail"),
					value: (row) => row.email
				},
				{
					header: t("colUniversity"),
					value: (row) => row.university
				},
				{
					header: t("colPhone"),
					value: (row) => row.phone ?? ""
				},
				{
					header: t("colLevel"),
					value: (row) => t(LEVEL_KEYS[row.level])
				},
				{
					header: t("fieldYears"),
					value: (row) => row.years_playing ? t(YEARS_KEYS[row.years_playing]) : ""
				},
				{
					header: t("fieldTrainingTime"),
					value: (row) => row.training_time ? t(TRAINING_KEYS[row.training_time]) : ""
				},
				{
					header: t("colRating"),
					value: (row) => row.fide_rating === null ? "" : row.fide_rating
				},
				{
					header: t("colInterests"),
					value: (row) => row.interests ?? ""
				},
				{
					header: t("colMessage"),
					value: (row) => row.message ?? ""
				},
				{
					header: t("colStatus"),
					value: (row) => t(MEMBERSHIP_STATUS_KEYS[row.status])
				},
				{
					header: t("colDate"),
					value: (row) => row.created_at
				}
			]));
		} catch {
			setActionError("adminActionError");
		} finally {
			setExporting(false);
		}
	};
	const rows = list.data?.rows ?? [];
	const total = list.data?.total ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: t("adminTabRequests")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: t("membershipTitle")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: t("adminRowsTotal", { n: total })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleExport,
					disabled: exporting,
					className: "btn-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), exporting ? t("adminExporting") : t("adminExportCsv")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSearch,
				role: "search",
				className: "flex flex-col gap-3 sm:flex-row sm:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "membership-search",
							className: "field-label",
							children: t("adminSearch")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "membership-search",
							type: "search",
							className: "input",
							placeholder: t("searchPlaceholder"),
							value: draftSearch,
							onChange: (e) => setDraftSearch(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "membership-status",
							className: "field-label",
							children: t("adminFilterStatus")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "membership-status",
							className: "input",
							value: status,
							onChange: (e) => {
								setPage(0);
								setStatus(e.target.value);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: t("filterAllStatuses")
							}), STATUSES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value,
								children: t(MEMBERSHIP_STATUS_KEYS[value])
							}, value))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-secondary",
						children: t("adminSearchButton")
					})
				]
			}),
			actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(actionError)
			}),
			list.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: list.reload,
					className: "btn-ghost mt-2 px-0 text-danger",
					children: t("retry")
				})]
			}),
			list.loading && !list.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("loading")
			}),
			list.data && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("adminNoRows")
			}),
			rows.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[1000px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-surface-2 text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colName")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colUniversity")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colLevel")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("fieldYears")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("fieldTrainingTime")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colPhone")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colStatus")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-start font-semibold",
								children: t("colDate")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								scope: "col",
								className: "px-4 py-3 text-end font-semibold",
								children: t("adminActions")
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-surface-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-ink",
										children: row.full_name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										dir: "ltr",
										className: "text-muted",
										children: row.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.university
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: t(LEVEL_KEYS[row.level])
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.years_playing ? t(YEARS_KEYS[row.years_playing]) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: row.training_time ? t(TRAINING_KEYS[row.training_time]) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									dir: "ltr",
									className: "px-4 py-3 text-start",
									children: row.phone ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "sr-only",
										htmlFor: `membership-status-${row.id}`,
										children: t("colStatus")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: `membership-status-${row.id}`,
										className: "input min-h-10 py-1",
										value: row.status,
										disabled: readOnly || busyId === row.id,
										onChange: (e) => handleStatusChange(row, e.target.value),
										children: STATUSES.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value,
											children: t(MEMBERSHIP_STATUS_KEYS[value])
										}, value))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: new Date(row.created_at).toLocaleDateString(language === "ar" ? "ar" : "en-GB")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-end",
									children: !readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "btn-ghost min-h-10 px-3 text-danger",
										disabled: busyId === row.id,
										onClick: () => handleDelete(row),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
												className: "h-4 w-4",
												"aria-hidden": "true"
											}),
											t("adminDelete"),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "sr-only",
												children: [": ", row.full_name]
											})
										]
									})
								})
							]
						}, row.id))
					})]
				})
			}),
			total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPager, {
				page,
				total,
				onPage: setPage
			})
		]
	});
}
function draftFrom(link) {
	return {
		labelEn: link?.label_en ?? "",
		labelAr: link?.label_ar ?? "",
		url: link?.url ?? "",
		sortOrder: link?.sort_order ?? 0,
		isActive: link?.is_active ?? true
	};
}
function validate(draft) {
	const errors = {};
	const label = draft.labelEn.trim();
	if (label.length < 2 || label.length > 100) errors.labelEn = "invalidRequired";
	if (draft.labelAr.length > 100) errors.labelAr = "errTooLong";
	if (!isSafeHttpsUrl(draft.url.trim())) errors.url = "invalidUrl";
	if (!Number.isInteger(draft.sortOrder) || draft.sortOrder < 0 || draft.sortOrder > 999) errors.sortOrder = "invalidRequired";
	return errors;
}
function LinkEditor({ link, onClose, onSaved }) {
	const { t } = useLanguage();
	const [draft, setDraft] = (0, import_react.useState)(() => draftFrom(link));
	const [errors, setErrors] = (0, import_react.useState)({});
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const set = (key, value) => {
		setDraft((current) => ({
			...current,
			[key]: value
		}));
		setErrors((current) => ({
			...current,
			[key]: void 0
		}));
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const found = validate(draft);
		setErrors(found);
		if (Object.keys(found).length > 0) return;
		setSaving(true);
		setSaveError(null);
		try {
			await saveLink(draft, link?.id ?? null);
			onSaved();
		} catch {
			setSaveError("adminActionError");
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
		title: t("linkFormTitle"),
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			noValidate: true,
			className: "space-y-6",
			children: [
				saveError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
					tone: "error",
					children: t(saveError)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("linkFieldLabelEn"),
							htmlFor: "link-label-en",
							required: true,
							error: errors.labelEn && t(errors.labelEn),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "link-label-en",
								className: "input",
								value: draft.labelEn,
								onChange: (e) => set("labelEn", e.target.value),
								"aria-invalid": Boolean(errors.labelEn)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("linkFieldLabelAr"),
							htmlFor: "link-label-ar",
							error: errors.labelAr && t(errors.labelAr),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "link-label-ar",
								className: "input",
								value: draft.labelAr,
								onChange: (e) => set("labelAr", e.target.value),
								"aria-invalid": Boolean(errors.labelAr)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("linkFieldUrl"),
							htmlFor: "link-url",
							required: true,
							error: errors.url && t(errors.url),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "link-url",
								dir: "ltr",
								className: "input",
								value: draft.url,
								onChange: (e) => set("url", e.target.value),
								"aria-invalid": Boolean(errors.url)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("adminSortOrder"),
							htmlFor: "link-sort",
							error: errors.sortOrder && t(errors.sortOrder),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "link-sort",
								inputMode: "numeric",
								dir: "ltr",
								className: "input",
								value: draft.sortOrder,
								onChange: (e) => set("sortOrder", Number(e.target.value)),
								"aria-invalid": Boolean(errors.sortOrder)
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex min-h-11 items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						className: "h-5 w-5 accent-[rgb(var(--c-gold))]",
						checked: draft.isActive,
						onChange: (e) => set("isActive", e.target.checked)
					}), t("linkFieldActive")]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "btn-secondary",
						onClick: onClose,
						children: t("adminCancel")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "btn-primary",
						disabled: saving,
						children: saving ? t("adminSaving") : t("adminSave")
					})]
				})
			]
		})
	});
}
var EMPTY_SPONSOR = {
	name: "",
	descriptionEn: "",
	descriptionAr: "",
	logoUrl: "",
	websiteUrl: "",
	sortOrder: 0,
	isActive: true
};
function PartnersPanel() {
	const { t, language, pick } = useLanguage();
	const ar = language === "ar";
	const sponsors = useAsyncData(() => listAdminSponsors(), []);
	const links = useAsyncData(() => listAdminLinks(), []);
	const [sponsorForm, setSponsorForm] = (0, import_react.useState)(null);
	const [linkForm, setLinkForm] = (0, import_react.useState)(null);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const openSponsor = (sponsor) => setSponsorForm({
		id: sponsor?.id ?? null,
		draft: sponsor ? {
			name: sponsor.name,
			descriptionEn: sponsor.description_en ?? "",
			descriptionAr: sponsor.description_ar ?? "",
			logoUrl: sponsor.logo_url ?? "",
			websiteUrl: sponsor.website_url ?? "",
			sortOrder: sponsor.sort_order,
			isActive: sponsor.is_active
		} : EMPTY_SPONSOR
	});
	const handleSponsorSave = async (submit) => {
		submit.preventDefault();
		if (!sponsorForm) return;
		const draft = sponsorForm.draft;
		if (!draft.name.trim()) {
			setFormError(ar ? "اسم الراعي مطلوب." : "Sponsor name is required.");
			return;
		}
		if (draft.logoUrl.trim() && !isSafeHttpsUrl(draft.logoUrl.trim())) {
			setFormError(t("siteLogoInvalid"));
			return;
		}
		if (draft.websiteUrl.trim() && !isSafeHttpsUrl(draft.websiteUrl.trim())) {
			setFormError(ar ? "أدخل رابطاً صحيحاً يبدأ بـ https." : "Enter a valid https web address.");
			return;
		}
		setSaving(true);
		setFormError(null);
		setActionError(null);
		try {
			await saveSponsor({
				...draft,
				name: draft.name.trim(),
				logoUrl: draft.logoUrl.trim(),
				websiteUrl: draft.websiteUrl.trim()
			}, sponsorForm.id);
			setSponsorForm(null);
			sponsors.reload();
		} catch {
			setActionError("adminActionError");
		} finally {
			setSaving(false);
		}
	};
	const handleDeleteSponsor = async (sponsor) => {
		if (!window.confirm(t("adminDeleteConfirm"))) return;
		setActionError(null);
		try {
			await deleteSponsor(sponsor.id);
			sponsors.reload();
		} catch {
			setActionError("adminActionError");
		}
	};
	const handleDeleteLink = async (link) => {
		if (!window.confirm(t("adminDeleteConfirm"))) return;
		setActionError(null);
		try {
			await deleteLink(link.id);
			links.reload();
		} catch {
			setActionError("adminActionError");
		}
	};
	const renderError = (error, reload) => error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
		tone: "error",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: reload,
			className: "btn-ghost mt-2 px-0 text-danger",
			children: t("retry")
		})]
	}) : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(actionError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: t("adminTabSponsors")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-2xl",
								children: t("sponsorsTitle")
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-primary",
							onClick: () => openSponsor(null),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							}), ar ? "راعٍ جديد" : "New sponsor"]
						})]
					}),
					renderError(sponsors.error, sponsors.reload),
					sponsors.loading && !sponsors.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("loading")
					}),
					sponsors.data && sponsors.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("adminNoRows")
					}),
					sponsors.data && sponsors.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: sponsors.data.map((sponsor) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [sponsor.logo_url && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: sponsor.logo_url,
									alt: "",
									className: "h-10 w-10 rounded object-contain"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-ink",
										children: sponsor.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted",
										children: pick(sponsor.description_en, sponsor.description_ar) || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted",
										children: [
											t("adminSortOrder"),
											": ",
											sponsor.sort_order,
											" ·",
											" ",
											sponsor.is_active ? t("registrationOpen") : t("registrationClosed")
										]
									})
								] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn-secondary",
									onClick: () => openSponsor(sponsor),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), t("adminEdit")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn-ghost text-danger",
									onClick: () => handleDeleteSponsor(sponsor),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), t("adminDelete")]
								})]
							})]
						}, sponsor.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "eyebrow",
									children: t("adminTabSponsors")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-2xl",
									children: t("linksTitle")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: t("linksIntro")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "btn-primary",
							onClick: () => setLinkForm({
								id: null,
								link: null
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
								className: "h-4 w-4",
								"aria-hidden": "true"
							}), ar ? "رابط جديد" : "New link"]
						})]
					}),
					renderError(links.error, links.reload),
					links.loading && !links.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("loading")
					}),
					links.data && links.data.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: t("adminNoRows")
					}),
					links.data && links.data.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-3",
						children: links.data.map((link) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "card flex flex-wrap items-center justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-ink",
									children: pick(link.label_en, link.label_ar)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: link.url,
									target: "_blank",
									rel: "noreferrer noopener",
									dir: "ltr",
									className: "text-sm text-gold underline",
									children: link.url
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted",
									children: [
										t("adminSortOrder"),
										": ",
										link.sort_order,
										" ·",
										" ",
										link.is_active ? t("registrationOpen") : t("registrationClosed")
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn-secondary",
									onClick: () => setLinkForm({
										id: link.id,
										link
									}),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), t("adminEdit")]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "btn-ghost text-danger",
									onClick: () => handleDeleteLink(link),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {
										className: "h-4 w-4",
										"aria-hidden": "true"
									}), t("adminDelete")]
								})]
							})]
						}, link.id))
					})
				]
			}),
			sponsorForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				title: sponsorForm.id ? t("adminEdit") : ar ? "راعٍ جديد" : "New sponsor",
				onClose: () => setSponsorForm(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSponsorSave,
					className: "space-y-4",
					children: [
						formError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
							tone: "error",
							children: formError
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("colName"),
							htmlFor: "sponsor-name",
							required: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "sponsor-name",
								className: "input",
								value: sponsorForm.draft.name,
								onChange: (e) => setSponsorForm({
									...sponsorForm,
									draft: {
										...sponsorForm.draft,
										name: e.target.value
									}
								}),
								required: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("contentEnglish"),
							htmlFor: "sponsor-desc-en",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "sponsor-desc-en",
								rows: 2,
								dir: "ltr",
								className: "input",
								value: sponsorForm.draft.descriptionEn,
								onChange: (e) => setSponsorForm({
									...sponsorForm,
									draft: {
										...sponsorForm.draft,
										descriptionEn: e.target.value
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: t("contentArabic"),
							htmlFor: "sponsor-desc-ar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "sponsor-desc-ar",
								rows: 2,
								dir: "rtl",
								className: "input",
								value: sponsorForm.draft.descriptionAr,
								onChange: (e) => setSponsorForm({
									...sponsorForm,
									draft: {
										...sponsorForm.draft,
										descriptionAr: e.target.value
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: ar ? "رابط الشعار (https)" : "Logo URL (https)",
							htmlFor: "sponsor-logo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "sponsor-logo",
								type: "url",
								dir: "ltr",
								className: "input",
								value: sponsorForm.draft.logoUrl,
								onChange: (e) => setSponsorForm({
									...sponsorForm,
									draft: {
										...sponsorForm.draft,
										logoUrl: e.target.value
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: ar ? "رابط الموقع (https)" : "Website URL (https)",
							htmlFor: "sponsor-website",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "sponsor-website",
								type: "url",
								dir: "ltr",
								className: "input",
								value: sponsorForm.draft.websiteUrl,
								onChange: (e) => setSponsorForm({
									...sponsorForm,
									draft: {
										...sponsorForm.draft,
										websiteUrl: e.target.value
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-end gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
								label: t("adminSortOrder"),
								htmlFor: "sponsor-order",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "sponsor-order",
									type: "number",
									min: 0,
									className: "input",
									value: sponsorForm.draft.sortOrder,
									onChange: (e) => setSponsorForm({
										...sponsorForm,
										draft: {
											...sponsorForm.draft,
											sortOrder: Number(e.target.value) || 0
										}
									})
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-11 items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: sponsorForm.draft.isActive,
									onChange: (e) => setSponsorForm({
										...sponsorForm,
										draft: {
											...sponsorForm.draft,
											isActive: e.target.checked
										}
									})
								}), ar ? "ظاهر على الموقع" : "Visible on the site"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "submit",
								className: "btn-primary",
								disabled: saving,
								children: saving ? t("adminSaving") : t("adminSave")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn-secondary",
								onClick: () => setSponsorForm(null),
								children: t("adminCancel")
							})]
						})
					]
				})
			}),
			linkForm && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkEditor, {
				link: linkForm.link,
				onClose: () => setLinkForm(null),
				onSaved: () => {
					setLinkForm(null);
					links.reload();
				}
			})
		]
	});
}
function DirectoryPanel() {
	const { t, language } = useLanguage();
	const ar = language === "ar";
	const directory = useAsyncData(() => exportMembershipRequests(), []);
	const [search, setSearch] = (0, import_react.useState)("");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [actionError, setActionError] = (0, import_react.useState)(null);
	const term = search.trim().toLowerCase();
	const people = (directory.data ?? []).filter((row) => term ? [
		row.full_name,
		row.email,
		row.university,
		row.phone ?? ""
	].join(" ").toLowerCase().includes(term) : true);
	const handleExport = async () => {
		setExporting(true);
		setActionError(null);
		try {
			downloadCsv("8squared-directory.csv", buildCsv(await exportMembershipRequests(), [
				{
					header: t("colName"),
					value: (row) => row.full_name
				},
				{
					header: t("colEmail"),
					value: (row) => row.email
				},
				{
					header: t("colPhone"),
					value: (row) => row.phone ?? ""
				},
				{
					header: t("colUniversity"),
					value: (row) => row.university
				},
				{
					header: t("colLevel"),
					value: (row) => t(LEVEL_KEYS[row.level])
				}
			]));
		} catch {
			setActionError("adminActionError");
		} finally {
			setExporting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: ar ? "دليل الاتصال" : "Contact directory"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-2xl",
							children: ar ? "الأعضاء والطلبات" : "Members and applicants"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: t("adminRowsTotal", { n: people.length })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleExport,
					disabled: exporting,
					className: "btn-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
						className: "h-4 w-4",
						"aria-hidden": "true"
					}), exporting ? t("adminExporting") : t("adminExportCsv")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					htmlFor: "directory-search",
					className: "field-label",
					children: t("adminSearch")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "directory-search",
					type: "search",
					className: "input",
					value: search,
					onChange: (e) => setSearch(e.target.value)
				})]
			}),
			actionError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(actionError)
			}),
			directory.error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Notice, {
				tone: "error",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: t("loadError") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: directory.reload,
					className: "btn-ghost mt-2 px-0 text-danger",
					children: t("retry")
				})]
			}),
			directory.loading && !directory.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("loading")
			}),
			directory.data && people.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("adminNoRows")
			}),
			people.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: people.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "card space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-ink",
							children: row.full_name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: row.university
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: t(LEVEL_KEYS[row.level])
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-1 pt-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `mailto:${row.email}`,
								dir: "ltr",
								className: "flex items-center gap-2 text-gold underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
									className: "h-4 w-4 shrink-0",
									"aria-hidden": "true"
								}), row.email]
							}), row.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: `tel:${row.phone}`,
								dir: "ltr",
								className: "flex items-center gap-2 text-gold underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
									className: "h-4 w-4 shrink-0",
									"aria-hidden": "true"
								}), row.phone]
							})]
						})
					]
				}, row.id))
			})
		]
	});
}
function SocialPanel() {
	const { language } = useLanguage();
	const ar = language === "ar";
	const links = useAsyncData(async () => {
		const { data, error } = await supabase.from("external_links").select("*").in("platform", [
			"linkedin",
			"instagram",
			"telegram"
		]);
		if (error) throw error;
		return data ?? [];
	}, []);
	const [draft, setDraft] = (0, import_react.useState)({});
	const [message, setMessage] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-5 max-w-xl",
		onSubmit: async (e) => {
			e.preventDefault();
			setBusy(true);
			try {
				for (const platform of [
					"linkedin",
					"instagram",
					"telegram"
				]) {
					const existing = links.data?.find((l) => l.platform === platform);
					const url = (draft[platform] ?? existing?.url ?? "").trim();
					if (url && !isSafeHttpsUrl(url)) throw Error("url");
					if (!existing && !url) continue;
					const { error } = await supabase.from("external_links").upsert({
						...existing ? { id: existing.id } : {},
						platform,
						url: url || existing?.url,
						label_en: platform,
						label_ar: platform,
						is_active: Boolean(url)
					});
					if (error) throw error;
				}
				setMessage(ar ? "تم الحفظ" : "Saved");
				links.reload();
			} catch {
				setMessage(ar ? "تحقق من الروابط؛ يجب أن تبدأ بـ https://" : "Check the links; use https://");
			} finally {
				setBusy(false);
			}
		},
		children: [
			[
				"linkedin",
				"instagram",
				"telegram"
			].map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				className: "field-label",
				htmlFor: `social-${p}`,
				children: p === "linkedin" ? "LinkedIn" : p === "instagram" ? "Instagram" : "Telegram"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				id: `social-${p}`,
				type: "url",
				dir: "ltr",
				className: "input",
				value: draft[p] ?? links.data?.find((l) => l.platform === p)?.url ?? "",
				onChange: (e) => setDraft({
					...draft,
					[p]: e.target.value
				})
			})] }, p)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				disabled: busy,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), ar ? "حفظ" : "Save"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				role: "status",
				children: message
			})
		]
	});
}
function AdminPage() {
	const { t, language } = useLanguage();
	const ar = language === "ar";
	const [gate, setGate] = (0, import_react.useState)("checking");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("memberships");
	const [unlock, setUnlock] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const unlockFn = useServerFn(unlockEditor);
	const lockFn = useServerFn(lockEditor);
	const verify = (0, import_react.useCallback)(async () => {
		try {
			const session = await getCurrentSession();
			if (!session || !await isCurrentUserAdmin()) {
				setGate("signed-out");
				return;
			}
			setEmail(session.user.email ?? "");
			setGate("admin");
			const { data: unlocked } = await supabase.rpc("is_admin");
			setEditing(unlocked === true);
		} catch {
			setGate("signed-out");
		}
	}, []);
	(0, import_react.useEffect)(() => {
		verify();
	}, [verify]);
	(0, import_react.useEffect)(() => {
		if (!editing) return;
		const id = setInterval(() => {
			supabase.rpc("is_admin").then(({ data }) => {
				if (!data) {
					setEditing(false);
					setTab("memberships");
				}
			});
		}, 3e4);
		return () => clearInterval(id);
	}, [editing]);
	if (gate === "checking") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "p-8 text-muted",
		children: t("adminChecking")
	});
	if (gate !== "admin") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminLogin, { onSignedIn: verify });
	const tabs = [
		{
			id: "memberships",
			label: ar ? "طلبات الانضمام السابقة" : "Previous memberships"
		},
		{
			id: "events",
			label: t("adminTabEvents")
		},
		...editing ? [
			{
				id: "directory",
				label: ar ? "الأعضاء" : "Members"
			},
			{
				id: "social",
				label: ar ? "التواصل" : "Social links"
			},
			{
				id: "partners",
				label: t("adminTabSponsors")
			},
			{
				id: "content",
				label: t("adminTabContent")
			},
			{
				id: "account",
				label: t("adminTabAccount")
			}
		] : []
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl",
					children: t("adminTitle")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: editing ? ar ? "وضع التعديل" : "Editing mode" : ar ? "للقراءة والتنزيل فقط" : "Read and download only"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "icon",
						className: "min-h-11 min-w-11",
						title: editing ? ar ? "قفل التعديل" : "Lock editing" : ar ? "فتح وضع التعديل" : "Unlock editing",
						"aria-label": editing ? ar ? "قفل التعديل" : "Lock editing" : ar ? "فتح وضع التعديل" : "Unlock editing",
						onClick: async () => {
							if (editing) {
								await lockFn();
								setEditing(false);
								setTab("memberships");
							} else setUnlock(true);
						},
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						onClick: async () => {
							try {
								await lockFn();
								await signOutAdmin();
							} finally {
								setEditing(false);
								setGate("signed-out");
							}
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, {}), t("adminLogout")]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				role: "tablist",
				className: "my-7 flex gap-2 overflow-x-auto border-b border-border",
				children: tabs.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					role: "tab",
					"aria-selected": tab === item.id,
					className: `min-h-11 shrink-0 ${tab === item.id ? "text-gold bg-surface-2" : ""}`,
					onClick: () => setTab(item.id),
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "tabpanel",
				children: [
					tab === "memberships" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipsPanel, { readOnly: !editing }),
					" ",
					tab === "events" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EventsPanel, { readOnly: !editing }),
					" ",
					editing && tab === "directory" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DirectoryPanel, {}),
					editing && tab === "social" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SocialPanel, {}),
					editing && tab === "partners" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartnersPanel, {}),
					editing && tab === "content" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContentPanel, {}),
					editing && tab === "account" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountPanel, {})
				]
			}),
			unlock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				title: ar ? "تأكيد صلاحية التعديل" : "Confirm editing access",
				onClose: () => {
					setUnlock(false);
					setPassword("");
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-5",
					onSubmit: async (e) => {
						e.preventDefault();
						setBusy(true);
						setError("");
						try {
							if (!(await unlockFn({ data: {
								email,
								password
							} })).ok) throw Error("denied");
							setEditing(true);
							setUnlock(false);
							setPassword("");
						} catch {
							setPassword("");
							setError(ar ? "البريد أو كلمة المرور غير صحيحة، أو الحساب غير مخوّل للتعديل." : "Incorrect credentials or account not authorized to edit.");
						} finally {
							setBusy(false);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "field-label",
							htmlFor: "unlock-email",
							children: t("fieldEmail")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "unlock-email",
							type: "email",
							required: true,
							className: "input",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							autoComplete: "username"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "field-label",
							htmlFor: "unlock-password",
							children: ar ? "كلمة المرور" : "Password"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "unlock-password",
							type: "password",
							required: true,
							className: "input",
							value: password,
							onChange: (e) => setPassword(e.target.value),
							autoComplete: "current-password"
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							role: "alert",
							className: "text-danger",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: ar ? "تأكيد" : "Confirm"
						})
					]
				})
			})
		]
	});
}
var SplitComponent = AdminPage;
//#endregion
export { SplitComponent as component };
