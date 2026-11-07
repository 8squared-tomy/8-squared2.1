import { n as objectType, r as stringType, t as booleanType } from "../_libs/zod.mjs";
import { t as supabase$1 } from "./client-DB-N03Bs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/publicApi-df8cJKU-.js
var supabase = supabase$1;
var EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
var PHONE_PATTERN = /^\+?[0-9 ()-]{6,25}$/;
function normalizeEmail(value) {
	return value.trim().toLowerCase();
}
function isValidEmail(value) {
	const email = normalizeEmail(value);
	return email.length >= 5 && email.length <= 254 && EMAIL_PATTERN.test(email);
}
function lengthBetween(value, min, max) {
	return value.length >= min && value.length <= max;
}
var LEVELS = [
	"beginner",
	"intermediate",
	"advanced",
	"expert"
];
var YEARS = [
	"under_1",
	"1_3",
	"3_5",
	"over_5"
];
var TRAINING_TIMES = [
	"weekday_evenings",
	"weekends",
	"flexible"
];
function validateMembership(input) {
	const errors = {};
	const first = input.firstName.trim();
	const last = input.lastName.trim();
	const university = input.university.trim();
	if (!lengthBetween(first, 2, 40)) errors.firstName = "errName";
	if (!lengthBetween(last, 2, 40)) errors.lastName = "errName";
	if (!isValidEmail(input.email)) errors.email = "errEmail";
	if (!lengthBetween(university, 2, 120)) errors.university = "errUniversity";
	if (!LEVELS.includes(input.level)) errors.level = "errLevel";
	if (!YEARS.includes(input.yearsPlaying)) errors.yearsPlaying = "invalidRequired";
	if (!TRAINING_TIMES.includes(input.trainingTime)) errors.trainingTime = "errTrainingTime";
	return errors;
}
var registrationSchema = objectType({
	fullName: stringType().trim().min(2, "errName").max(100, "errName"),
	email: stringType().trim().refine(isValidEmail, "errEmail"),
	university: stringType().trim().min(2, "errUniversity").max(120, "errUniversity"),
	needsAccommodation: booleanType(),
	residence: stringType(),
	bacRegistrationNumber: stringType(),
	phone: stringType()
}).superRefine((input, ctx) => {
	if (!input.needsAccommodation) return;
	if (!lengthBetween(input.residence.trim(), 2, 120)) ctx.addIssue({
		code: "custom",
		path: ["residence"],
		message: "errResidence"
	});
	if (!/^\d{1,30}$/.test(input.bacRegistrationNumber.trim())) ctx.addIssue({
		code: "custom",
		path: ["bacRegistrationNumber"],
		message: "errBacNumber"
	});
	if (!PHONE_PATTERN.test(input.phone.trim())) ctx.addIssue({
		code: "custom",
		path: ["phone"],
		message: "errAccommodationPhone"
	});
});
function validateRegistration(input) {
	const errors = {};
	const result = registrationSchema.safeParse(input);
	if (!result.success) for (const issue of result.error.issues) {
		const field = issue.path[0];
		if (!errors[field]) errors[field] = issue.message;
	}
	return errors;
}
function validateEventRegistration(input) {
	const errors = {};
	const first = input.firstName.trim();
	const last = input.lastName.trim();
	if (!lengthBetween(first, 2, 40)) errors.firstName = "errName";
	if (!lengthBetween(last, 2, 40)) errors.lastName = "errName";
	const shared = validateRegistration({
		fullName: `${first} ${last}`,
		email: input.email,
		university: input.university,
		phone: input.phone,
		needsAccommodation: input.needsAccommodation,
		residence: input.residence,
		bacRegistrationNumber: input.bacRegistrationNumber
	});
	for (const [key, value] of Object.entries(shared)) if (key !== "fullName" && value) errors[key] = value;
	return errors;
}
function isSafeHttpsUrl(value) {
	try {
		return new URL(value).protocol === "https:";
	} catch {
		return false;
	}
}
function errorKeyFrom(error) {
	const message = error?.message ?? "";
	if (message.includes("RATE_LIMITED")) return "errRateLimited";
	if (message.includes("ALREADY_REGISTERED")) return "errAlreadyRegistered";
	if (message.includes("EVENT_UNAVAILABLE")) return "errEventUnavailable";
	if (message.includes("INVALID_RESIDENCE")) return "errResidence";
	if (message.includes("INVALID_BAC_NUMBER")) return "errBacNumber";
	if (message.includes("INVALID_ACCOMMODATION_PHONE")) return "errAccommodationPhone";
	return "errGeneric";
}
async function fetchPublishedEvents() {
	const { data, error } = await supabase.from("events").select("*").eq("status", "published").order("starts_at", { ascending: true }).limit(200);
	if (error) throw error;
	return data ?? [];
}
async function fetchEventById(id) {
	const { data, error } = await supabase.from("events").select("*").eq("id", id).eq("status", "published").maybeSingle();
	if (error) throw error;
	return data;
}
async function fetchEventSeatCounts() {
	const { data, error } = await supabase.rpc("get_event_seat_counts");
	if (error) throw error;
	return Object.fromEntries((data ?? []).map((row) => [row.event_id, row.confirmed_count]));
}
async function fetchEventSponsors(eventId) {
	const { data, error } = await supabase.from("event_sponsors").select("sponsor:sponsors(*)").eq("event_id", eventId);
	if (error) throw error;
	return (data ?? []).map((row) => row.sponsor).filter((sponsor) => sponsor?.is_active);
}
async function fetchActiveSponsors() {
	const { data, error } = await supabase.from("sponsors").select("*").eq("is_active", true).order("sort_order", { ascending: true }).limit(200);
	if (error) throw error;
	return data ?? [];
}
async function fetchActiveLinks() {
	const { data, error } = await supabase.from("external_links").select("*").eq("is_active", true).order("sort_order", { ascending: true }).limit(100);
	if (error) throw error;
	return data ?? [];
}
var siteContentRequest = null;
function fetchSiteContent() {
	if (typeof window === "undefined") return loadSiteContent();
	if (!siteContentRequest) siteContentRequest = loadSiteContent().catch((error) => {
		siteContentRequest = null;
		throw error;
	});
	return siteContentRequest;
}
function resetSiteContentCache() {
	siteContentRequest = null;
}
async function loadSiteContent() {
	const { data, error } = await supabase.from("site_content").select("key, value_en, value_ar").limit(100);
	if (error) throw error;
	return data ?? [];
}
async function submitMembershipRequest(payload) {
	const { error } = await supabase.rpc("submit_membership_request", {
		p_full_name: payload.fullName.trim(),
		p_email: normalizeEmail(payload.email),
		p_university: payload.university.trim(),
		p_phone: null,
		p_level: payload.level,
		p_years_playing: payload.yearsPlaying,
		p_fide_rating: null,
		p_interests: null,
		p_message: null,
		p_training_time: payload.trainingTime
	});
	if (error) return {
		ok: false,
		errorKey: errorKeyFrom(error)
	};
	return {
		ok: true,
		data: null
	};
}
async function registerForEvent(payload) {
	const parsed = registrationSchema.safeParse(payload);
	if (!parsed.success) return {
		ok: false,
		errorKey: "invalidRequired"
	};
	const input = parsed.data;
	const { data, error } = await supabase.rpc("register_for_event", {
		p_event_id: payload.eventId,
		p_full_name: input.fullName,
		p_email: normalizeEmail(input.email),
		p_university: input.university,
		p_phone: input.needsAccommodation ? input.phone.trim() : "",
		p_needs_accommodation: input.needsAccommodation,
		p_residence: input.needsAccommodation ? input.residence.trim() : "",
		p_bac_registration_number: input.needsAccommodation ? input.bacRegistrationNumber.trim() : ""
	});
	if (error) return {
		ok: false,
		errorKey: errorKeyFrom(error)
	};
	if (data !== "confirmed" && data !== "waitlisted") return {
		ok: false,
		errorKey: "errGeneric"
	};
	return {
		ok: true,
		data
	};
}
//#endregion
export { supabase as _, fetchActiveSponsors as a, fetchEventSponsors as c, isSafeHttpsUrl as d, isValidEmail as f, submitMembershipRequest as g, resetSiteContentCache as h, fetchActiveLinks as i, fetchPublishedEvents as l, registerForEvent as m, TRAINING_TIMES as n, fetchEventById as o, normalizeEmail as p, YEARS as r, fetchEventSeatCounts as s, LEVELS as t, fetchSiteContent as u, validateEventRegistration as v, validateMembership as y };
