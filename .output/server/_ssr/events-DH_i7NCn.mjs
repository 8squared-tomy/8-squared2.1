//#region node_modules/.nitro/vite/services/ssr/assets/events-DH_i7NCn.js
function getEventState(event, confirmedCount, now = /* @__PURE__ */ new Date()) {
	if (new Date(event.ends_at ?? event.starts_at).getTime() < now.getTime()) return "past";
	if (!event.registration_open) return "closed";
	if (event.capacity !== null && confirmedCount >= event.capacity) return "full";
	return "open";
}
function seatsLeft(event, confirmedCount) {
	if (event.capacity === null) return null;
	return Math.max(event.capacity - confirmedCount, 0);
}
function formatDateTime(iso, language) {
	return new Date(iso).toLocaleString(language === "ar" ? "ar" : "en-GB", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
//#endregion
export { getEventState as n, seatsLeft as r, formatDateTime as t };
