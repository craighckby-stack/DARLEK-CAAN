(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([["app/not-found"],{

/***/ "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22%2Fapp%2Fapplet%2Fsrc%2Fapp%2Fnot-found.tsx%22%2C%22ids%22%3A%5B%5D%7D&server=false!":
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve().then(__webpack_require__.bind(__webpack_require__, "(app-pages-browser)/./src/app/not-found.tsx"));

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/client/app-dir/link.js":
/***/ ((module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;

const _interop_require_default = __webpack_require__("(app-pages-browser)/./node_modules/@swc/helpers/esm/_interop_require_default.js");
const _jsxruntime = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-runtime.js");
const _react = _interop_require_default._(__webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js"));
const _formaturl = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/shared/lib/router/utils/format-url.js");
const _approutercontextsharedruntime = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/shared/lib/app-router-context.shared-runtime.js");
const _useintersection = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/use-intersection.js");
const _routerreducertypes = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/components/router-reducer/router-reducer-types.js");
const _usemergedref = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/use-merged-ref.js");
const _utils = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/shared/lib/utils.js");
const _addbasepath = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/add-base-path.js");

function prefetch(router, href, options) {
    if (typeof window === 'undefined' || !router) return;
    try {
        const res = router.prefetch(href, options);
        if (res && typeof res.catch === 'function') {
            res.catch(() => {});
        }
    } catch (_) {}
}

function isModifiedEvent(event) {
    const eventTarget = event.currentTarget;
    const target = eventTarget.getAttribute('target');
    return (target && target !== '_self') || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || (event.nativeEvent && event.nativeEvent.which === 2);
}

function linkClicked(e, router, href, as, replace, shallow, scroll) {
    const { nodeName } = e.currentTarget;
    if (nodeName.toUpperCase() === 'A' && isModifiedEvent(e)) return;
    e.preventDefault();
    const routerScroll = scroll != null ? scroll : true;
    _react.default.startTransition(() => {
        if ('beforePopState' in router) {
            router[replace ? 'replace' : 'push'](href, as, { shallow, scroll: routerScroll });
        } else {
            router[replace ? 'replace' : 'push'](as || href, { scroll: routerScroll });
        }
    });
}

function formatStringOrUrl(urlObjOrString) {
    return typeof urlObjOrString === 'string' ? urlObjOrString : (0, _formaturl.formatUrl)(urlObjOrString);
}

const INTERSECTION_CONFIG = { rootMargin: '200px' };

const Link = _react.default.forwardRef(function LinkComponent(props, forwardedRef) {
    const {
        href: hrefProp,
        as: asProp,
        children: childrenProp,
        prefetch: prefetchProp = null,
        passHref,
        replace,
        shallow,
        scroll,
        onClick,
        onMouseEnter: onMouseEnterProp,
        onTouchStart: onTouchStartProp,
        legacyBehavior = false,
        ...restProps
    } = props;

    let children = childrenProp;
    if (legacyBehavior && (typeof children === 'string' || typeof children === 'number')) {
        children = (0, _jsxruntime.jsx)("a", { children });
    }

    const router = _react.default.useContext(_approutercontextsharedruntime.AppRouterContext);
    const prefetchEnabled = prefetchProp !== false;
    const appPrefetchKind = prefetchProp === null ? _routerreducertypes.PrefetchKind.AUTO : _routerreducertypes.PrefetchKind.FULL;

    const { href, as } = _react.default.useMemo(() => {
        const resolvedHref = formatStringOrUrl(hrefProp);
        return {
            href: resolvedHref,
            as: asProp ? formatStringOrUrl(asProp) : resolvedHref
        };
    }, [hrefProp, asProp]);

    const previousHref = _react.default.useRef(href);
    const previousAs = _react.default.useRef(as);

    let child = legacyBehavior ? _react.default.Children.only(children) : children;
    const childRef = legacyBehavior ? (child && typeof child === 'object' ? child.ref : null) : forwardedRef;
    const [setIntersectionRef, isVisible, resetVisible] = (0, _useintersection.useIntersection)(INTERSECTION_CONFIG);

    const setIntersectionWithResetRef = _react.default.useCallback((el) => {
        if (previousAs.current !== as || previousHref.current !== href) {
            resetVisible();
            previousAs.current = as;
            previousHref.current = href;
        }
        setIntersectionRef(el);
    }, [as, href, resetVisible, setIntersectionRef]);

    const setRef = (0, _usemergedref.useMergedRef)(setIntersectionWithResetRef, childRef);

    _react.default.useEffect(() => {
        if (!router || !isVisible || !prefetchEnabled) return;
        prefetch(router, href, { kind: appPrefetchKind });
    }, [as, href, isVisible, prefetchEnabled, router, appPrefetchKind]);

    const childProps = {
        ref: setRef,
        onClick(e) {
            if (!legacyBehavior && typeof onClick === 'function') onClick(e);
            if (legacyBehavior && child?.props && typeof child.props.onClick === 'function') {
                child.props.onClick(e);
            }
            if (!router || e.defaultPrevented) return;
            linkClicked(e, router, href, as, replace, shallow, scroll);
        },
        onMouseEnter(e) {
            if (!legacyBehavior && typeof onMouseEnterProp === 'function') onMouseEnterProp(e);
            if (legacyBehavior && child?.props && typeof child.props.onMouseEnter === 'function') {
                child.props.onMouseEnter(e);
            }
            if (!router || !prefetchEnabled) return;
            prefetch(router, href, { kind: appPrefetchKind });
        },
        onTouchStart(e) {
            if (!legacyBehavior && typeof onTouchStartProp === 'function') onTouchStartProp(e);
            if (legacyBehavior && child?.props && typeof child.props.onTouchStart === 'function') {
                child.props.onTouchStart(e);
            }
            if (!router || !prefetchEnabled) return;
            prefetch(router, href, { kind: appPrefetchKind });
        }
    };

    if ((0, _utils.isAbsoluteUrl)(as)) {
        childProps.href = as;
    } else if (!legacyBehavior || passHref || (child?.type === 'a' && !('href' in child.props))) {
        childProps.href = (0, _addbasepath.addBasePath)(as);
    }

    return legacyBehavior 
        ? _react.default.cloneElement(child, childProps) 
        : (0, _jsxruntime.jsx)("a", { ...restProps, ...childProps, children });
});

exports.default = Link;
if (typeof exports.default === 'object' && exports.default !== null && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', { value: true });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/client/request-idle-callback.js":
/***/ ((module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestIdleCallback = exports.cancelIdleCallback = void 0;

const requestIdleCallback = (typeof self !== 'undefined' && self.requestIdleCallback && self.requestIdleCallback.bind(window)) || function(cb) {
    const start = Date.now();
    return self.setTimeout(() => {
        cb({
            didTimeout: false,
            timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
        });
    }, 1);
};
exports.requestIdleCallback = requestIdleCallback;

const cancelIdleCallback = (typeof self !== 'undefined' && self.cancelIdleCallback && self.cancelIdleCallback.bind(window)) || function(id) {
    return clearTimeout(id);
};
exports.cancelIdleCallback = cancelIdleCallback;

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/client/use-intersection.js":
/***/ ((module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useIntersection = useIntersection;

const _react = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js");
const _requestidlecallback = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/request-idle-callback.js");

const hasIntersectionObserver = typeof IntersectionObserver === 'function';
const observerCache = new Map();

function getObserverKey(root, margin) {
    return (root ? root.id || 'custom-root' : 'null') + '|' + (margin || '');
}

function createObserver(options) {
    const root = options.root || null;
    const margin = options.rootMargin || '';
    const key = getObserverKey(root, margin);
    
    let cached = observerCache.get(key);
    if (cached) return cached;

    const elements = new Map();
    const observer = new IntersectionObserver((entries) => {
        for (let i = 0, len = entries.length; i < len; i++) {
            const entry = entries[i];
            const callback = elements.get(entry.target);
            if (callback && (entry.isIntersecting || entry.intersectionRatio > 0)) {
                callback(true);
            }
        }
    }, options);

    const instance = { key, observer, elements };
    observerCache.set(key, instance);
    return instance;
}

function observe(element, callback, options) {
    const instance = createObserver(options);
    instance.elements.set(element, callback);
    instance.observer.observe(element);
    
    return function unobserve() {
        instance.elements.delete(element);
        instance.observer.unobserve(element);
        if (instance.elements.size === 0) {
            instance.observer.disconnect();
            observerCache.delete(instance.key);
        }
    };
}

function useIntersection({ rootRef, rootMargin, disabled }) {
    const isDisabled = disabled || !hasIntersectionObserver;
    const [visible, setVisible] = (0, _react.useState)(false);
    const elementRef = (0, _react.useRef)(null);

    const setElement = (0, _react.useCallback)((element) => {
        elementRef.current = element;
    }, []);

    (0, _react.useEffect)(() => {
        if (hasIntersectionObserver) {
            if (isDisabled || visible) return;
            const element = elementRef.current;
            if (element && element.tagName) {
                return observe(element, (isVisible) => isVisible && setVisible(true), {
                    root: rootRef?.current,
                    rootMargin
                });
            }
        } else if (!visible) {
            const idleCallback = (0, _requestidlecallback.requestIdleCallback)(() => setVisible(true));
            return () => (0, _requestidlecallback.cancelIdleCallback)(idleCallback);
        }
    }, [isDisabled, rootMargin, rootRef, visible]);

    const resetVisible = (0, _react.useCallback)(() => setVisible(false), []);

    return [setElement, visible, resetVisible];
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/client/use-merged-ref.js":
/***/ ((module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMergedRef = useMergedRef;

const _react = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js");

function applyRef(ref, current) {
    if (typeof ref === 'function') {
        const cleanup = ref(current);
        return typeof cleanup === 'function' ? cleanup : () => ref(null);
    }
    if (ref && typeof ref === 'object') {
        ref.current = current;
        return () => { ref.current = null; };
    }
    return () => {};
}

function useMergedRef(refA, refB) {
    const cleanupA = (0, _react.useRef)(null);
    const cleanupB = (0, _react.useRef)(null);

    return (0, _react.useMemo)(() => {
        if (!refA || !refB) return refA || refB;
        return (current) => {
            if (current === null) {
                if (cleanupA.current) { cleanupA.current(); cleanupA.current = null; }
                if (cleanupB.current) { cleanupB.current(); cleanupB.current = null; }
            } else {
                cleanupA.current = applyRef(refA, current);
                cleanupB.current = applyRef(refB, current);
            }
        };
    }, [refA, refB]);
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/shared/lib/router/utils/format-url.js":
/***/ ((module, exports, __webpack_require__) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUrl = formatUrl;
exports.formatWithValidation = formatWithValidation;
exports.urlObjectKeys = void 0;

const _interop_require_wildcard = __webpack_require__("(app-pages-browser)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js");
const _querystring = _interop_require_wildcard._(__webpack_require__("(app-pages-browser)/./node_modules/next/dist/shared/lib/router/utils/querystring.js"));
const slashedProtocols = /^(https?|ftp|gopher|file)$/;

function formatUrl(urlObj) {
    let { auth, hostname, protocol = '', pathname = '', hash = '', query = '', port, host: urlHost } = urlObj;
    let host = false;

    if (auth) {
        auth = encodeURIComponent(auth).replace(/%3A/i, ':') + '@';
    } else {
        auth = '';
    }

    if (urlHost) {
        host = auth + urlHost;
    } else if (hostname) {
        host = auth + (hostname.includes(':') ? `[${hostname}]` : hostname) + (port ? ':' + port : '');
    }

    if (query && typeof query === 'object') {
        query = String(_querystring.urlQueryToSearchParams(query));
    }

    let search = urlObj.search || (query ? '?' + query : '');
    if (protocol && !protocol.endsWith(':')) protocol += ':';

    const protoName = protocol ? protocol.slice(0, -1) : '';
    if (urlObj.slashes || ((!protocol || slashedProtocols.test(protoName)) && host !== false)) {
        host = '//' + (host || '');
        if (pathname && pathname.charCodeAt(0) !== 47) pathname = '/' + pathname;
    } else if (!host) {
        host = '';
    }

    if (hash && hash.charCodeAt(0) !== 35) hash = '#' + hash;
    if (search && search.charCodeAt(0) !== 63) search = '?' + search;

    pathname = pathname.replace(/[?#]/g, encodeURIComponent);
    if (search.includes('#')) search = search.replace('#', '%23');

    return protocol + host + pathname + search + hash;
}

const urlObjectKeys = ['auth', 'hash', 'host', 'hostname', 'href', 'path', 'pathname', 'port', 'protocol', 'query', 'search', 'slashes'];
exports.urlObjectKeys = urlObjectKeys;

function formatWithValidation(url) {
    return formatUrl(url);
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/shared/lib/router/utils/querystring.js":
/***/ ((module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assign = assign;
exports.searchParamsToUrlQuery = searchParamsToUrlQuery;
exports.urlQueryToSearchParams = urlQueryToSearchParams;

function searchParamsToUrlQuery(searchParams) {
    const query = Object.create(null);
    searchParams.forEach((value, key) => {
        const cur = query[key];
        if (cur === void 0) {
            query[key] = value;
        } else if (Array.isArray(cur)) {
            cur.push(value);
        } else {
            query[key] = [cur, value];
        }
    });
    return query;
}

function stringifyUrlQueryParam(param) {
    return (typeof param === 'string' || (typeof param === 'number' && !Number.isNaN(param)) || typeof param === 'boolean') ? String(param) : '';
}

function urlQueryToSearchParams(urlQuery) {
    const result = new URLSearchParams();
    const entries = Object.entries(urlQuery);
    for (let i = 0, len = entries.length; i < len; i++) {
        const [key, value] = entries[i];
        if (Array.isArray(value)) {
            for (let j = 0, vlen = value.length; j < vlen; j++) {
                result.append(key, stringifyUrlQueryParam(value[j]));
            }
        } else {
            result.set(key, stringifyUrlQueryParam(value));
        }
    }
    return result;
}

function assign(target, ...searchParamsList) {
    for (let i = 0, len = searchParamsList.length; i < len; i++) {
        const searchParams = searchParamsList[i];
        const keys = Array.from(searchParams.keys());
        for (let j = 0, klen = keys.length; j < klen; j++) {
            target.delete(keys[j]);
        }
        searchParams.forEach((value, key) => target.append(key, value));
    }
    return target;
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/shared/lib/utils.js":
/***/ ((module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEB_VITALS = exports.ST = exports.SP = void 0;
exports.execOnce = execOnce;
exports.getDisplayName = getDisplayName;
exports.getLocationOrigin = getLocationOrigin;
exports.getURL = getURL;
exports.isAbsoluteUrl = isAbsoluteUrl;
exports.isResSent = isResSent;
exports.loadGetInitialProps = loadGetInitialProps;
exports.normalizeRepeatedSlashes = normalizeRepeatedSlashes;
exports.stringifyError = stringifyError;
exports.PageNotFoundError = exports.NormalizeError = exports.MissingStaticPage = exports.MiddlewareNotFoundError = exports.DecodeError = void 0;

const WEB_VITALS = ['CLS', 'FCP', 'FID', 'INP', 'LCP', 'TTFB'];
exports.WEB_VITALS = WEB_VITALS;

function execOnce(fn) {
    let used = false;
    let result;
    return function(...args) {
        if (!used) {
            used = true;
            result = fn(...args);
        }
        return result;
    };
}

const ABSOLUTE_URL_REGEX = /^[a-zA-Z][a-zA-Z\d+\-.]*?:/;
function isAbsoluteUrl(url) {
    return ABSOLUTE_URL_REGEX.test(url);
}

function getLocationOrigin() {
    const { protocol, hostname, port } = window.location;
    return protocol + "//" + hostname + (port ? ':' + port : '');
}

function getURL() {
    const { href } = window.location;
    return href.substring(getLocationOrigin().length);
}

function getDisplayName(Component) {
    return typeof Component === 'string' ? Component : (Component.displayName || Component.name || 'Unknown');
}

function isResSent(res) {
    return Boolean(res.finished || res.headersSent);
}

function normalizeRepeatedSlashes(url) {
    const qIndex = url.indexOf('?');
    if (qIndex === -1) {
        return url.replace(/\\/g, '/').replace(/\/+/g, '/');
    }
    const path = url.slice(0, qIndex).replace(/\\/g, '/').replace(/\/+/g, '/');
    return path + '?' + url.slice(qIndex + 1);
}

async function loadGetInitialProps(App, ctx) {
    const res = ctx.res || (ctx.ctx && ctx.ctx.res);
    if (!App.getInitialProps) {
        if (ctx.ctx && ctx.Component) {
            return { pageProps: await loadGetInitialProps(ctx.Component, ctx.ctx) };
        }
        return {};
    }
    const props = await App.getInitialProps(ctx);
    if (res && isResSent(res)) return props;
    if (!props) {
        throw new Error(`"${getDisplayName(App)}.getInitialProps()" should resolve to an object. But found "${props}" instead.`);
    }
    return props;
}

const SP = typeof performance !== 'undefined';
exports.SP = SP;
const ST = SP && typeof performance.mark === 'function' && typeof performance.measure === 'function' && typeof performance.getEntriesByName === 'function';
exports.ST = ST;

class DecodeError extends Error {}
exports.DecodeError = DecodeError;
class NormalizeError extends Error {}
exports.NormalizeError = NormalizeError;
class PageNotFoundError extends Error {
    constructor(page) {
        super();
        this.code = 'ENOENT';
        this.name = 'PageNotFoundError';
        this.message = "Cannot find module for page: " + page;
    }
}
exports.PageNotFoundError = PageNotFoundError;
class MissingStaticPage extends Error {
    constructor(page, message) {
        super();
        this.message = "Failed to load static file for page: " + page + " " + message;
    }
}
exports.MissingStaticPage = MissingStaticPage;
class MiddlewareNotFoundError extends Error {
    constructor() {
        super();
        this.code = 'ENOENT';
        this.message = "Cannot find the middleware module";
    }
}
exports.MiddlewareNotFoundError = MiddlewareNotFoundError;

function stringifyError(error) {
    return JSON.stringify({ message: error.message, stack: error.stack });
}

/***/ }),

/***/ "(app-pages-browser)/./src/app/not-found.tsx":
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
    "default": () => NotFound,
    dynamic: () => dynamic
});

const _jsxruntime = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js");
const _react = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js");
const _link = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/client/app-dir/link.js");
const _linkDefault = _link.default || _link;

const dynamic = 'force-dynamic';

function handleReturn() {
    window.location.href = '/';
}

function NotFound() {
    const [countdown, setCountdown] = (0, _react.useState)(3);

    (0, _react.useEffect)(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    window.location.href = '/';
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (0, _jsxruntime.jsxDEV)("main", {
        className: "min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black text-gray-200 font-mono",
        role: "alert",
        "aria-labelledby": "not-found-title",
        children: (0, _jsxruntime.jsxDEV)("div", {
            className: "max-w-md w-full border border-red-900/60 bg-neutral-950 p-6 rounded-lg shadow-2xl",
            children: [
                (0, _jsxruntime.jsxDEV)("div", {
                    className: "flex items-center justify-center gap-2 mb-3",
                    children: [
                        (0, _jsxruntime.jsxDEV)("span", { className: "w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" }),
                        (0, _jsxruntime.jsxDEV)("h1", {
                            id: "not-found-title",
                            className: "text-xl font-bold text-red-500 tracking-wide",
                            children: "[404] ROUTE NOT FOUND"
                        })
                    ]
                }),
                (0, _jsxruntime.jsxDEV)("p", {
                    className: "text-xs text-gray-400 mb-4 leading-relaxed",
                    children: "The requested system node or route does not exist within the Dalek Caan architecture."
                }),
                (0, _jsxruntime.jsxDEV)("p", {
                    className: "text-[11px] text-amber-400/80 mb-6 font-mono",
                    children: ["Auto-redirecting to Command Console in ", countdown, "s..."]
                }),
                (0, _jsxruntime.jsxDEV)("div", {
                    className: "flex flex-col sm:flex-row items-center justify-center gap-3",
                    children: [
                        (0, _jsxruntime.jsxDEV)("button", {
                            type: "button",
                            onClick: handleReturn,
                            className: "w-full sm:w-auto px-5 py-2 text-xs font-semibold bg-red-950 hover:bg-red-900 border border-red-700 text-red-100 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-sm",
                            children: "Return to Command Console"
                        }),
                        (0, _jsxruntime.jsxDEV)(_linkDefault, {
                            href: "/",
                            className: "w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-gray-300 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-500",
                            children: "Direct Link (/)"
                        })
                    ]
                })
            ]
        })
    });
}

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js":
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
const React = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/index.js");
const REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
const REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");

exports.Fragment = REACT_FRAGMENT_TYPE;
exports.jsxDEV = function(type, config, maybeKey) {
    const props = {};
    let key = maybeKey !== void 0 ? String(maybeKey) : (config?.key !== void 0 ? String(config.key) : null);
    
    if (config) {
        for (const propName in config) {
            if (propName !== 'key') {
                props[propName] = config[propName];
            }
        }
    }
    
    return {
        $$typeof: REACT_ELEMENT_TYPE,
        type: type,
        key: key,
        props: props,
        _owner: null,
        _store: { validated: 1 }
    };
};

/***/ }),

/***/ "(app-pages-browser)/./node_modules/next/dist/compiled/react/jsx-dev-runtime.js":
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
module.exports = __webpack_require__("(app-pages-browser)/./node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js");

/***/ })

},
/******/ __webpack_require__ => {
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["main-app"], () => (__webpack_exec__("(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?modules=%7B%22request%22%3A%22%2Fapp%2Fapplet%2Fsrc%2Fapp%2Fnot-found.tsx%22%2C%22ids%22%3A%5B%5D%7D&server=false!")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);