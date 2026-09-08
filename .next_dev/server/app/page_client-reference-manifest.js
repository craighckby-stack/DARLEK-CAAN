/**
 * EMG Core v49 Neural Code Optimizer Engine
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Optimization Goal: READABILITY - Pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */
(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Global Environment Resolution
  // ---------------------------------------------------------------------------

  const resolveGlobalContext = () => {
    try {
      if (typeof globalThis !== "undefined" && globalThis !== null) return globalThis;
      if (typeof self !== "undefined" && self !== null) return self;
      if (typeof window !== "undefined" && window !== null) return window;
      if (typeof global !== "undefined" && global !== null) return global;
      return typeof Function === "function" ? Function("return this")() : Object.create(null);
    } catch {
      return Object.create(null);
    }
  };

  const globalContext = resolveGlobalContext();
  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  // ---------------------------------------------------------------------------
  // Manifest Constants & Sentinels
  // ---------------------------------------------------------------------------

  const RSC_MANIFEST_REGISTRY_KEY = "__RSC_MANIFEST";
  const ROUTE_IDENTIFIER = "/page";

  const EMPTY_OBJECT = Object.freeze(Object.create(null));
  const EMPTY_ARRAY = Object.freeze([]);

  // ---------------------------------------------------------------------------
  // Descriptor Factory Functions
  // ---------------------------------------------------------------------------

  const createModuleExportDescriptor = (moduleId, chunks = EMPTY_ARRAY, isAsync = false) =>
    Object.freeze({
      "*": Object.freeze({
        id: String(moduleId),
        name: "*",
        chunks: Array.isArray(chunks) ? chunks : EMPTY_ARRAY,
        async: Boolean(isAsync),
      }),
    });

  const createClientReferenceDescriptor = (browserModuleId, chunks = EMPTY_ARRAY, isAsync = false) =>
    Object.freeze({
      id: String(browserModuleId),
      name: "*",
      chunks: Array.isArray(chunks) ? chunks : EMPTY_ARRAY,
      async: Boolean(isAsync),
    });

  // ---------------------------------------------------------------------------
  // Shared Chunk Definitions
  // ---------------------------------------------------------------------------

  const CHUNKS = Object.freeze({
    LAYOUT: Object.freeze(["app/layout", "static/chunks/app/layout.js"]),
    ERROR: Object.freeze(["app/error", "static/chunks/app/error.js"]),
    NOT_FOUND: Object.freeze(["app/not-found", "static/chunks/app/not-found.js"]),
    PAGE: Object.freeze(["app/page", "static/chunks/app/page.js"]),
    INTERNALS: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]),
  });

  // ---------------------------------------------------------------------------
  // Manifest Configuration & Mappings
  // ---------------------------------------------------------------------------

  const moduleLoadingConfiguration = Object.freeze({
    prefix: "/_next/",
    crossOrigin: null,
  });

  const ssrModuleMappings = Object.freeze({
    "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleExportDescriptor("(ssr)/./src/components/ui/toaster.tsx"),
    "(app-pages-browser)/./src/app/error.tsx": createModuleExportDescriptor("(ssr)/./src/app/error.tsx"),
    "(app-pages-browser)/./src/app/not-found.tsx": createModuleExportDescriptor("(ssr)/./src/app/not-found.tsx"),
    "(app-pages-browser)/./src/components/PageClient.tsx": createModuleExportDescriptor("(ssr)/./src/components/PageClient.tsx"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/client-page.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/client-segment.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/layout-router.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js"),
    "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleExportDescriptor("(ssr)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
  });

  const rscModuleMappings = Object.freeze({
    "(app-pages-browser)/./src/app/globals.css": createModuleExportDescriptor("(rsc)/./src/app/globals.css"),
    "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleExportDescriptor("(rsc)/./src/components/ui/toaster.tsx"),
    "(app-pages-browser)/./src/app/error.tsx": createModuleExportDescriptor("(rsc)/./src/app/error.tsx"),
    "(app-pages-browser)/./src/app/not-found.tsx": createModuleExportDescriptor("(rsc)/./src/app/not-found.tsx"),
    "(app-pages-browser)/./src/components/PageClient.tsx": createModuleExportDescriptor("(rsc)/./src/components/PageClient.tsx"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/client-page.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/client-segment.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/layout-router.js"),
    "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/client/components/render-from-template-context.js"),
    "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleExportDescriptor("(rsc)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
  });

  const clientModulesMap = Object.freeze({
    "/app/applet/src/app/globals.css": createClientReferenceDescriptor("(app-pages-browser)/./src/app/globals.css", CHUNKS.LAYOUT),
    "/app/applet/src/components/ui/toaster.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/components/ui/toaster.tsx", CHUNKS.LAYOUT),
    "/app/applet/src/app/error.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/app/error.tsx", CHUNKS.ERROR),
    "/app/applet/src/app/not-found.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/app/not-found.tsx", CHUNKS.NOT_FOUND),
    "/app/applet/src/components/PageClient.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/components/PageClient.tsx", CHUNKS.PAGE),

    "/app/applet/node_modules/next/dist/client/components/client-page.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/client-page.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/client-page.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/client/components/client-segment.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/client-segment.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/client-segment.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/client/components/error-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/error-boundary.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/error-boundary.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/http-access-fallback/error-boundary.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/client/components/layout-router.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/layout-router.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/layout-router.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/render-from-template-context.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": createClientReferenceDescriptor("(app-pages-browser)/./src/components/render-from-template-context.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/lib/metadata/metadata-boundary.js", CHUNKS.INTERNALS),
    "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": createClientReferenceDescriptor("(app-pages-browser)/./src/lib/metadata/metadata-boundary.js", CHUNKS.INTERNALS),
  });

  const entryCSSFilesMap = Object.freeze({
    "/app/applet/src/": EMPTY_ARRAY,
    "/app/applet/src/app/layout": Object.freeze([
      Object.freeze({
        inlined: false,
        path: "static/css/app/layout.css",
      }),
    ]),
    "/app/applet/src/app/error": EMPTY_ARRAY,
    "/app/applet/src/app/not-found": EMPTY_ARRAY,
    "/app/applet/src/app/page": EMPTY_ARRAY,
  });

  // ---------------------------------------------------------------------------
  // Manifest Aggregation & Global Registration
  // ---------------------------------------------------------------------------

  const pageClientReferenceManifest = Object.freeze({
    moduleLoading: moduleLoadingConfiguration,
    ssrModuleMapping: ssrModuleMappings,
    edgeSSRModuleMapping: EMPTY_OBJECT,
    clientModules: clientModulesMap,
    entryCSSFiles: entryCSSFilesMap,
    rscModuleMapping: rscModuleMappings,
    edgeRscModuleMapping: EMPTY_OBJECT,
  });

  try {
    let rscManifestRegistry = globalContext[RSC_MANIFEST_REGISTRY_KEY];
    if (!rscManifestRegistry || typeof rscManifestRegistry !== "object") {
      rscManifestRegistry = Object.create(null);
      Object.defineProperty(globalContext, RSC_MANIFEST_REGISTRY_KEY, {
        value: rscManifestRegistry,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    }

    Object.defineProperty(rscManifestRegistry, ROUTE_IDENTIFIER, {
      value: pageClientReferenceManifest,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } catch {
    // Graceful degradation on restricted global contexts
  }
})();