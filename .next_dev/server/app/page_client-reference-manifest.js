/**
 * EMG Core v49 Neural Code Optimizer Engine
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Goal: PERFORMANCE - Execution speed, memory footprint reduction, caching, and allocation efficiency.
 */
(function initializeRscClientManifest(scope) {
  "use strict";

  if (!scope || (typeof scope !== "object" && typeof scope !== "function")) {
    return;
  }

  const RSC_MANIFEST_KEY = "__RSC_MANIFEST";
  const MANIFEST_ROUTE_KEY = "/page";

  const manifestPayload = {
    moduleLoading: {
      prefix: "/_next/",
      crossOrigin: null,
    },
    ssrModuleMapping: {
      "(app-pages-browser)/./src/components/ui/toaster.tsx": {
        "*": { id: "(ssr)/./src/components/ui/toaster.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/app/error.tsx": {
        "*": { id: "(ssr)/./src/app/error.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/app/not-found.tsx": {
        "*": { id: "(ssr)/./src/app/not-found.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/components/PageClient.tsx": {
        "*": { id: "(ssr)/./src/components/PageClient.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": {
        "*": { id: "(ssr)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: [], async: false }
      }
    },
    edgeSSRModuleMapping: {},
    clientModules: {
      "/app/applet/src/app/globals.css": {
        id: "(app-pages-browser)/./src/app/globals.css",
        name: "*",
        chunks: ["app/layout", "static/chunks/app/layout.js"],
        async: false,
      },
      "/app/applet/src/components/ui/toaster.tsx": {
        id: "(app-pages-browser)/./src/components/ui/toaster.tsx",
        name: "*",
        chunks: ["app/layout", "static/chunks/app/layout.js"],
        async: false,
      },
      "/app/applet/src/app/error.tsx": {
        id: "(app-pages-browser)/./src/app/error.tsx",
        name: "*",
        chunks: ["app/error", "static/chunks/app/error.js"],
        async: false,
      },
      "/app/applet/src/app/not-found.tsx": {
        id: "(app-pages-browser)/./src/app/not-found.tsx",
        name: "*",
        chunks: ["app/not-found", "static/chunks/app/not-found.js"],
        async: false,
      },
      "/app/applet/src/components/PageClient.tsx": {
        id: "(app-pages-browser)/./src/components/PageClient.tsx",
        name: "*",
        chunks: ["app/page", "static/chunks/app/page.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/client-page.js": {
        id: "(app-pages-browser)/./src/components/client-page.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": {
        id: "(app-pages-browser)/./src/components/client-page.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/client-segment.js": {
        id: "(app-pages-browser)/./src/components/client-segment.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": {
        id: "(app-pages-browser)/./src/components/client-segment.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/error-boundary.js": {
        id: "(app-pages-browser)/./src/components/error-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": {
        id: "(app-pages-browser)/./src/components/error-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": {
        id: "(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": {
        id: "(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/layout-router.js": {
        id: "(app-pages-browser)/./src/components/layout-router.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": {
        id: "(app-pages-browser)/./src/components/layout-router.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": {
        id: "(app-pages-browser)/./src/components/render-from-template-context.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": {
        id: "(app-pages-browser)/./src/components/render-from-template-context.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": {
        id: "(app-pages-browser)/./src/lib/metadata/metadata-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      },
      "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": {
        id: "(app-pages-browser)/./src/lib/metadata/metadata-boundary.js",
        name: "*",
        chunks: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
        async: false,
      }
    },
    entryCSSFiles: {
      "/app/applet/src/": [],
      "/app/applet/src/app/layout": [
        {
          inlined: false,
          path: "static/css/app/layout.css",
        }
      ],
      "/app/applet/src/app/error": [],
      "/app/applet/src/app/not-found": [],
      "/app/applet/src/app/page": [],
    },
    rscModuleMapping: {
      "(app-pages-browser)/./src/app/globals.css": {
        "*": { id: "(rsc)/./src/app/globals.css", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/components/ui/toaster.tsx": {
        "*": { id: "(rsc)/./src/components/ui/toaster.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/app/error.tsx": {
        "*": { id: "(rsc)/./src/app/error.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/app/not-found.tsx": {
        "*": { id: "(rsc)/./src/app/not-found.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./src/components/PageClient.tsx": {
        "*": { id: "(rsc)/./src/components/PageClient.tsx", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/client-page.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/client-segment.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/error-boundary.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/layout-router.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/client/components/render-from-template-context.js", name: "*", chunks: [], async: false }
      },
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": {
        "*": { id: "(rsc)/./node_modules/next/dist/lib/metadata/metadata-boundary.js", name: "*", chunks: [], async: false }
      }
    },
    edgeRscModuleMapping: {},
  };

  let rscManifest = scope[RSC_MANIFEST_KEY];
  if (!rscManifest || typeof rscManifest !== "object") {
    rscManifest = Object.create(null);
    Object.defineProperty(scope, RSC_MANIFEST_KEY, {
      value: rscManifest,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  Object.defineProperty(rscManifest, MANIFEST_ROUTE_KEY, {
    value: manifestPayload,
    writable: true,
    enumerable: true,
    configurable: true,
  });

})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : typeof global !== "undefined"
    ? global
    : this
);