"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * Route Client Reference Manifest Registrar for: /api/brain/route
 */
(() => {
  const globalTarget = 
    typeof globalThis !== "undefined" ? globalThis :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global : null;

  if (!globalTarget) return;

  const manifestStore = globalTarget.__RSC_MANIFEST ??= Object.create(null);

  manifestStore["/api/brain/route"] = Object.freeze({
    moduleLoading: Object.freeze({
      prefix: "/_next/",
      crossOrigin: null
    }),
    ssrModuleMapping: Object.freeze({
      "(app-pages-browser)/./src/components/ui/toaster.tsx": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./src/components/ui/toaster.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/app/error.tsx": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./src/app/error.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/app/not-found.tsx": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./src/app/not-found.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/components/PageClient.tsx": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./src/components/PageClient.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(ssr)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) })
    }),
    edgeSSRModuleMapping: Object.freeze({}),
    clientModules: Object.freeze({
      "/app/applet/src/app/globals.css": Object.freeze({ id: "(app-pages-browser)/./src/app/globals.css", name: "*", chunks: Object.freeze(["app/layout", "static/chunks/app/layout.js"]), async: false }),
      "/app/applet/src/components/ui/toaster.tsx": Object.freeze({ id: "(app-pages-browser)/./src/components/ui/toaster.tsx", name: "*", chunks: Object.freeze(["app/layout", "static/chunks/app/layout.js"]), async: false }),
      "/app/applet/src/app/error.tsx": Object.freeze({ id: "(app-pages-browser)/./src/app/error.tsx", name: "*", chunks: Object.freeze(["app/error", "static/chunks/app/error.js"]), async: false }),
      "/app/applet/src/app/not-found.tsx": Object.freeze({ id: "(app-pages-browser)/./src/app/not-found.tsx", name: "*", chunks: Object.freeze(["app/not-found", "static/chunks/app/not-found.js"]), async: false }),
      "/app/applet/src/components/PageClient.tsx": Object.freeze({ id: "(app-pages-browser)/./src/components/PageClient.tsx", name: "*", chunks: Object.freeze(["app/page", "static/chunks/app/page.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/client-page.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/client-segment.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/error-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/layout-router.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false }),
      "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": Object.freeze({ id: "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]), async: false })
    }),
    entryCSSFiles: Object.freeze({
      "/app/applet/src/": Object.freeze([]),
      "/app/applet/src/app/layout": Object.freeze([Object.freeze({ inlined: false, path: "static/css/app/layout.css" })]),
      "/app/applet/src/app/error": Object.freeze([]),
      "/app/applet/src/app/not-found": Object.freeze([]),
      "/app/applet/src/app/page": Object.freeze([]),
      "/app/applet/src/app/api/brain/route": Object.freeze([])
    }),
    rscModuleMapping: Object.freeze({
      "(app-pages-browser)/./src/app/globals.css": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./src/app/globals.css", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/components/ui/toaster.tsx": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./src/components/ui/toaster.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/app/error.tsx": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./src/app/error.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/app/not-found.tsx": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./src/app/not-found.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./src/components/PageClient.tsx": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./src/components/PageClient.tsx", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: Object.freeze([]), async: false }) }),
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": Object.freeze({ "*": Object.freeze({ id: "(rsc)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: Object.freeze([]), async: false }) })
    }),
    edgeRscModuleMapping: Object.freeze({})
  });
})();