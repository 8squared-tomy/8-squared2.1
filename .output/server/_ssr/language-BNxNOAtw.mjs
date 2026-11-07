//#region node_modules/.nitro/vite/services/ssr/assets/language-BNxNOAtw.js
var LANGUAGE_COOKIE = "8squared-language";
function parseLanguage(value) {
	return value === "ar" ? "ar" : "en";
}
function readLanguageCookie(cookieHeader) {
	return parseLanguage(cookieHeader.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${LANGUAGE_COOKIE}=`))?.slice(18));
}
function writeLanguageCookie(language) {
	document.cookie = `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; SameSite=Lax`;
}
//#endregion
export { writeLanguageCookie as n, readLanguageCookie as t };
