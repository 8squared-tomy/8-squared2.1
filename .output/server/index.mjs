globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-11-07T19:08:15.434Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-11-07T19:08:15.434Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/EventCard-X3vWDkQA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8f9-9gUJSZWNtMgWj/qQczlgSJX7V5Y\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 2297,
		"path": "../public/assets/EventCard-X3vWDkQA.js"
	},
	"/assets/FormField-BUff4nOw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"629-VRC1rEx1QK7Jpuf1ZusR6kmoyV0\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 1577,
		"path": "../public/assets/FormField-BUff4nOw.js"
	},
	"/assets/LanguageProvider-DURf0EFj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9729-wFxim/ToyTqctQDcH41yb7bR+N8\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 38697,
		"path": "../public/assets/LanguageProvider-DURf0EFj.js"
	},
	"/assets/Modal-BMTsv8wH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"506-EHexYzblqhXdJwQByeAX0mvmgk4\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 1286,
		"path": "../public/assets/Modal-BMTsv8wH.js"
	},
	"/assets/admin-DyieWQ72.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e144-bLbsYT86JDzOk2lcfMgvnXdxDcI\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 57668,
		"path": "../public/assets/admin-DyieWQ72.js"
	},
	"/assets/arrow-left-Dz83tI-s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-8WOzA/6oVeXy9O/CmtWY9T+aq3U\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 154,
		"path": "../public/assets/arrow-left-Dz83tI-s.js"
	},
	"/assets/createMiddleware-C7J40w0x.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9449-+WO5yEm17FmjDFNgfvPrGgylgao\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 37961,
		"path": "../public/assets/createMiddleware-C7J40w0x.js"
	},
	"/assets/events-BkgoBgLQ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ea-ETZ1xp7HjWMhGFDieZBOvdKa3e8\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 490,
		"path": "../public/assets/events-BkgoBgLQ.js"
	},
	"/assets/events._eventId-B1xchlc8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d0f-fdPmuXwbT2EwFZcpT4fy0H7wI3I\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 7439,
		"path": "../public/assets/events._eventId-B1xchlc8.js"
	},
	"/assets/events.index-DIYg0fA3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8aa-wtKYIxC4YgA+AEPKMaq3EOlG94s\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 2218,
		"path": "../public/assets/events.index-DIYg0fA3.js"
	},
	"/assets/membership-BBq1w_eH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1289-Xn7f98uLOf0CAgwBIlWqprmXeF0\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 4745,
		"path": "../public/assets/membership-BBq1w_eH.js"
	},
	"/assets/routes-0s5h6e1v.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f45-LY0UHNQbBNpE4BD1KZ7tBYnasck\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 28485,
		"path": "../public/assets/routes-0s5h6e1v.js"
	},
	"/assets/sponsors-CD8Pg2MF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"842-hB4psB6CSumZ0CawLs3rtdPLGMQ\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 2114,
		"path": "../public/assets/sponsors-CD8Pg2MF.js"
	},
	"/assets/styles-DUrgHlkn.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"8811-llf+MuyB40rJQzx7/Svt8bIyKa4\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 34833,
		"path": "../public/assets/styles-DUrgHlkn.css"
	},
	"/assets/terms-DSTtJ73k.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d63-7F6gevSxc2NDqimv6U0Q1CGknK8\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 7523,
		"path": "../public/assets/terms-DSTtJ73k.js"
	},
	"/assets/useRouter-pMNNqsML.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"256-SloCMPzQ7KhpyhEy/e6lg9bhhMQ\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 598,
		"path": "../public/assets/useRouter-pMNNqsML.js"
	},
	"/assets/index-DURJ8hlf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98b98-FrClx0M20n5gEBCz6nGSJvy6WjA\"",
		"mtime": "2026-11-07T19:08:15.042Z",
		"size": 625560,
		"path": "../public/assets/index-DURJ8hlf.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_B7yGuI = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_B7yGuI
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
