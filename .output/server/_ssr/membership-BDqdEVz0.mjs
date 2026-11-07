import { n as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as Button } from "./button-BEg5oiP4.mjs";
import { n as useLanguage } from "./LanguageProvider-BkuMpPKM.mjs";
import { h as submitMembershipRequest, n as TRAINING_TIMES, r as YEARS, t as LEVELS, v as validateMembership } from "./publicApi-BNNW0lc7.mjs";
import { D as CircleCheck } from "../_libs/lucide-react.mjs";
import { n as Notice, t as FormField } from "./FormField-BAimJ5Nb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/membership-BDqdEVz0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY = {
	firstName: "",
	lastName: "",
	email: "",
	university: "",
	level: "",
	yearsPlaying: "",
	trainingTime: ""
};
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
var TRAINING_KEYS = {
	weekday_evenings: "trainingWeekdayEvenings",
	weekends: "trainingWeekends",
	flexible: "trainingFlexible"
};
function MembershipForm() {
	const { t } = useLanguage();
	const [form, setForm] = (0, import_react.useState)(EMPTY);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [serverError, setServerError] = (0, import_react.useState)(null);
	const [sent, setSent] = (0, import_react.useState)(false);
	const set = (field) => (value) => {
		setForm((current) => ({
			...current,
			[field]: value
		}));
		setErrors((current) => ({
			...current,
			[field]: void 0
		}));
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const found = validateMembership(form);
		setErrors(found);
		const firstError = Object.keys(found)[0];
		if (firstError) {
			document.getElementById(`mem-${firstError}`)?.focus();
			return;
		}
		setSubmitting(true);
		setServerError(null);
		const outcome = await submitMembershipRequest({
			fullName: `${form.firstName.trim()} ${form.lastName.trim()}`,
			email: form.email,
			university: form.university,
			level: form.level,
			yearsPlaying: form.yearsPlaying,
			trainingTime: form.trainingTime
		});
		setSubmitting(false);
		if (outcome.ok) {
			setSent(true);
			setForm(EMPTY);
		} else setServerError(outcome.errorKey);
	};
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "status",
		className: "card flex flex-col items-start gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
				className: "h-10 w-10 text-success",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-2xl",
				children: t("membershipSentTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-muted",
				children: t("membershipSentBody")
			})
		]
	});
	const selectClass = "input";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		noValidate: true,
		onSubmit: handleSubmit,
		className: "space-y-6",
		children: [
			serverError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Notice, {
				tone: "error",
				children: t(serverError)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldFirstName"),
				htmlFor: "mem-firstName",
				required: true,
				error: errors.firstName && t(errors.firstName),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "mem-firstName",
					name: "firstName",
					autoComplete: "given-name",
					maxLength: 40,
					required: true,
					className: "input",
					value: form.firstName,
					onChange: (e) => set("firstName")(e.target.value),
					"aria-invalid": Boolean(errors.firstName)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldLastName"),
				htmlFor: "mem-lastName",
				required: true,
				error: errors.lastName && t(errors.lastName),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "mem-lastName",
					name: "lastName",
					autoComplete: "family-name",
					maxLength: 40,
					required: true,
					className: "input",
					value: form.lastName,
					onChange: (e) => set("lastName")(e.target.value),
					"aria-invalid": Boolean(errors.lastName)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldUniversity"),
				htmlFor: "mem-university",
				required: true,
				error: errors.university && t(errors.university),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "mem-university",
					name: "university",
					autoComplete: "organization",
					maxLength: 120,
					required: true,
					className: "input",
					value: form.university,
					onChange: (e) => set("university")(e.target.value),
					"aria-invalid": Boolean(errors.university)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldEmail"),
				htmlFor: "mem-email",
				required: true,
				error: errors.email && t(errors.email),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "mem-email",
					name: "email",
					type: "email",
					autoComplete: "email",
					inputMode: "email",
					dir: "ltr",
					maxLength: 254,
					required: true,
					className: "input",
					value: form.email,
					onChange: (e) => set("email")(e.target.value),
					"aria-invalid": Boolean(errors.email)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldLevel"),
				htmlFor: "mem-level",
				required: true,
				error: errors.level && t(errors.level),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "mem-level",
					name: "level",
					required: true,
					className: selectClass,
					value: form.level,
					onChange: (e) => set("level")(e.target.value),
					"aria-invalid": Boolean(errors.level),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("chooseOne")
					}), LEVELS.map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: level,
						children: t(LEVEL_KEYS[level])
					}, level))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldYears"),
				htmlFor: "mem-yearsPlaying",
				required: true,
				error: errors.yearsPlaying && t(errors.yearsPlaying),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "mem-yearsPlaying",
					name: "yearsPlaying",
					required: true,
					className: selectClass,
					value: form.yearsPlaying,
					onChange: (e) => set("yearsPlaying")(e.target.value),
					"aria-invalid": Boolean(errors.yearsPlaying),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("chooseOne")
					}), YEARS.map((years) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: years,
						children: t(YEARS_KEYS[years])
					}, years))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: t("fieldTrainingTime"),
				htmlFor: "mem-trainingTime",
				required: true,
				error: errors.trainingTime && t(errors.trainingTime),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "mem-trainingTime",
					name: "trainingTime",
					required: true,
					className: selectClass,
					value: form.trainingTime,
					onChange: (e) => set("trainingTime")(e.target.value),
					"aria-invalid": Boolean(errors.trainingTime),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: t("chooseOne")
					}), TRAINING_TIMES.map((time) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: time,
						children: t(TRAINING_KEYS[time])
					}, time))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "btn-primary h-auto min-h-11 w-full",
				disabled: submitting,
				children: submitting ? t("submitting") : t("submit")
			})
		]
	});
}
function MembershipPage() {
	const { t } = useLanguage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl px-4 py-12 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "eyebrow",
				children: t("navMembership")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 text-3xl",
				children: t("membershipTitle")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MembershipForm, {})
			})
		]
	});
}
var SplitComponent = MembershipPage;
//#endregion
export { SplitComponent as component };
