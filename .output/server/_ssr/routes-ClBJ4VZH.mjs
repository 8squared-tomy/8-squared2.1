import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as supabase, i as fetchActiveLinks, l as fetchPublishedEvents, s as fetchEventSeatCounts, u as fetchSiteContent } from "./publicApi-BNNW0lc7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ClBJ4VZH.js
async function fetchMembers() {
	const { data, error } = await supabase.from("club_members").select("*").eq("is_active", true).order("sort_order");
	if (error) throw error;
	const members = data ?? [];
	const paths = members.map((m) => m.photo_url).filter((url) => Boolean(url) && !url.startsWith("https://"));
	if (!paths.length) return members;
	const { data: signed, error: signError } = await supabase.storage.from("member-portraits").createSignedUrls(paths, 3600);
	const urlByPath = /* @__PURE__ */ new Map();
	if (!signError) {
		for (const item of signed ?? []) if (item.path && item.signedUrl) urlByPath.set(item.path, item.signedUrl);
	}
	return members.map((m) => {
		if (!m.photo_url || m.photo_url.startsWith("https://")) return m;
		return {
			...m,
			photo_url: urlByPath.get(m.photo_url) ?? null
		};
	});
}
async function fetchSocialLinks() {
	const { data, error } = await supabase.from("external_links").select("id,platform,url,is_active").in("platform", [
		"linkedin",
		"instagram",
		"telegram"
	]).eq("is_active", true);
	if (error) throw error;
	return data ?? [];
}
async function settle(promise) {
	try {
		return {
			data: await promise,
			error: false
		};
	} catch {
		return {
			data: null,
			error: true
		};
	}
}
async function loadHomeData() {
	const [content, links, events, members] = await Promise.all([
		settle(fetchSiteContent()),
		settle(fetchActiveLinks()),
		settle(Promise.all([fetchPublishedEvents(), fetchEventSeatCounts()]).then(([list, counts]) => ({
			events: list,
			counts
		}))),
		settle(fetchMembers())
	]);
	return {
		content,
		links,
		events,
		members
	};
}
var $$splitComponentImporter = () => import("./routes-Dwv5WauE.mjs");
var COVER_IMAGE = "/chess-cover.jpg";
var Route = createFileRoute("/")({
	loader: () => loadHomeData(),
	head: () => ({
		links: [{
			rel: "preload",
			as: "image",
			href: COVER_IMAGE,
			fetchPriority: "high"
		}],
		meta: [
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:image",
				content: COVER_IMAGE
			},
			{
				name: "twitter:image",
				content: COVER_IMAGE
			},
			{ title: "8squared Chess Club — Learn, train, compete" },
			{
				name: "description",
				content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us."
			},
			{
				property: "og:title",
				content: "8squared Chess Club — Learn, train, compete"
			},
			{
				property: "og:description",
				content: "A home for chess players at every level. Join the 8squared chess club, attend events and grow with us."
			}
		]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { fetchSocialLinks as n, Route as t };
