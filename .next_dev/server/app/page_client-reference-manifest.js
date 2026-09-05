/**
 * EMG Core v49 Neural Code Optimizer Engine
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Goal: READABILITY - Modern idioms, expressive abstractions, and clean architectural clarity.
 */
(function initializeRscClientManifest(globalContext) {
  "use strict";

  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  const RSC_MANIFEST_KEY = "__RSC_MANIFEST";
  const ROUTE_MANIFEST_KEY = "/page";

  const moduleLoadingConfig = Object.freeze({
    prefix: "/_next/",
    crossOrigin: null,
  });

  const createModuleDefinition = (id, chunks = [], isAsync = false) => Object.freeze({
    "*": Object.freeze({
      id,
      name: "*",
      chunks,
      async: isAsync,
    }),
  });

  const createClientModuleDefinition = (id, chunks, isAsync = false) => Object.freeze({
    id,
    name: "*",
    chunks,
    async: isAsync,
  });

  const ssrModuleMappings = Object.freeze({
    "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleDefinition("(ssr)/./src/components/ui/toaster.tsx"),
    "(app-pages-browser)/./src/app/error.tsx": createModuleDefinition("(ssr)/./src/app/error.tsx"),
    "(app-pages-browser)/./src/app/not-found.tsx": createModuleDefinition("(ssr)/./src/app/not-found.tsx"),
    "(app-pages-browser)/./src/components/PageClient.tsx": createModuleDefinition("(ssr)/./src/components/PageClient.tsx"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/client-page.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/client-segment.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/layout-router.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleDefinition("(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js"),
    "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleDefinition("(ssr)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
  });

  const clientModulesMap = Object.freeze({
    "/app/applet/src/app/globals.css": createClientModuleDefinition("(app-pages-browser)/./src/app/globals.css", ["app/layout", "static/chunks/app/layout.js"]),
    "/app/applet/src/components/ui/toaster.tsx": createClientModuleDefinition("(app-pages-browser)/./src/components/ui/toaster.tsx", ["app/layout", "static/chunks/app/layout.js"]),
    "/app/applet/src/app/error.tsx": createClientModuleDefinition("(app-pages-browser)/./src/app/error.tsx", ["app/error", "static/chunks/app/error.js"]),
    "/app/applet/src/app/not-found.tsx": createClientModuleDefinition("(app-pages-browser)/./src/app/not-found.tsx", ["app/not-found", "static/chunks/app/not-found.js"]),
    "/app/applet/src/components/PageClient.tsx": createClientModuleDefinition("(app-pages-browser)/./src/components/PageClient.tsx", ["app/page", "static/chunks/app/page.js"]),
    "/app/applet/node_modules/next/dist/client/components/client-page.js": createClientModuleDefinition("(app-pages-browser)/./src/components/client-page.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": createClientModuleDefinition("(app-pages-browser)/./src/components/client-page.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/client/components/client-segment.js": createClientModuleDefinition("(app-pages-browser)/./src/components/client-segment.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": createClientModuleDefinition("(app-pages-browser)/./src/components/client-segment.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/client/components/error-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/components/error-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/components/error-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/client/components/layout-router.js": createClientModuleDefinition("(app-pages-browser)/./src/components/layout-router.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": createClientModuleDefinition("(app-pages-browser)/./src/components/layout-router.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": createClientModuleDefinition("(app-pages-browser)/./src/components/render-from-template-context.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": createClientModuleDefinition("(app-pages-browser)/./src/components/render-from-template-context.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/lib/metadata/metadata-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
    "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": createClientModuleDefinition("(app-pages-browser)/./src/lib/metadata/metadata-boundary.js", ["app-pages-internals", "static/chunks/app-pages-internals.js"]),
  });

  const entryCSSFilesMap = Object.freeze({
    "/app/applet/src/": [],
    "/app/applet/src/app/layout": Object.freeze([
      Object.freeze({
        inlined: false,
        path: "static/css/app/layout.css",
      })
    ]),
    "/app/applet/src/app/error": [],
    "/app/applet/src/app/not-found": [],
    "/app/applet/src/app/page": [],
  });

  const rscModuleMappings = Object.freeze({
    "(app-pages-browser)/./src/app/globals.css": createModuleDefinition("(rsc)/./src/app/globals.css"),
    "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleDefinition("(rsc)/./src/components/ui/toaster.tsx"),
    "(app-pages-browser)/./src/app/error.tsx": createModuleDefinition("(rsc)/./src/app/error.tsx"),
    "(app-pages-browser)/./src/app/not-found.tsx": createModuleDefinition("(rsc)/./src/app/not-found.tsx"),
    "(app-pages-browser)/./src/components/PageClient.tsx": createModuleDefinition("(rsc)/./src/components/PageClient.tsx"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/client-page.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/client-segment.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/layout-router.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleDefinition("(rsc)/./node_modules/next/dist/client/components/render-from-template-context.js"),
    "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleDefinition("(rsc)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
  });

  const clientReferenceManifestPayload = Object.freeze({
    moduleLoading: moduleLoadingConfig,
    ssrModuleMapping: ssrModuleMappings,
    edgeSSRModuleMapping: Object.freeze({}),
    clientModules: clientModulesMap,
    entryCSSFiles: entryCSSFilesMap,
    rscModuleMapping: rscModuleMappings,
    edgeRscModuleMapping: Object.freeze({}),
  });

  let rscManifestRegistry = globalContext[RSC_MANIFEST_KEY];
  if (!rscManifestRegistry || typeof rscManifestRegistry !== "object") {
    rscManifestRegistry = Object.create(null);
    Object.defineProperty(globalContext, RSC_MANIFEST_KEY, {
      value: rscManifestRegistry,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }

  Object.defineProperty(rscManifestRegistry, ROUTE_MANIFEST_KEY, {
    value: clientReferenceManifestPayload,
    writable: true,
    enumerable: true,
    configurable: true,
  });

})(
  (() => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return typeof Function === "function" ? Function("return this")() : {};
  })()
);