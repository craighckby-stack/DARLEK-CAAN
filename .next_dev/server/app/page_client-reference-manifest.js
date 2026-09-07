/**
 * EMG Core v49 Neural Code Optimizer Engine
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Optimization Goal: COMPREHENSIVE - Sovereign overhaul for peak performance, memory efficiency, type safety, and robust runtime protection.
 */
(() => {
  "use strict";

  // ---------------------------------------------------------------------------
  // Global Environment Resolution (Hardened & Memory-Safe)
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
  // Manifest Constants & Empty Sentinels (Frozen for Zero-Allocation)
  // ---------------------------------------------------------------------------

  const RSC_MANIFEST_REGISTRY_KEY = "__RSC_MANIFEST";
  const ROUTE_IDENTIFIER = "/page";

  const EMPTY_OBJECT = Object.freeze(Object.create(null));
  const EMPTY_ARRAY = Object.freeze([]);

  // ---------------------------------------------------------------------------
  // Factory Functions for Manifest Descriptors (Optimized & Validated)
  // ---------------------------------------------------------------------------

  /**
   * Creates a wildcard module export mapping for Server-Side Rendering (SSR) or RSC contexts.
   *
   * @param {string} moduleId - Target bundle module identifier
   * @param {readonly string[]} [chunks] - Associated script/style chunks
   * @param {boolean} [isAsync=false] - Flag indicating asynchronous evaluation
   * @returns {Readonly<{ "*": Readonly<{ id: string, name: string, chunks: readonly string[], async: boolean }> }>}
   */
  const createModuleExportDescriptor = (moduleId, chunks = EMPTY_ARRAY, isAsync = false) =>
    Object.freeze({
      "*": Object.freeze({
        id: String(moduleId),
        name: "*",
        chunks: Array.isArray(chunks) ? chunks : EMPTY_ARRAY,
        async: Boolean(isAsync),
      }),
    });

  /**
   * Creates a client module reference descriptor.
   *
   * @param {string} browserModuleId - Browser-scoped module identifier
   * @param {readonly string[]} chunks - Associated bundle chunk paths
   * @param {boolean} [isAsync=false] - Flag indicating asynchronous evaluation
   * @returns {Readonly<{ id: string, name: string, chunks: readonly string[], async: boolean }>}
   */
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
    // Application Modules
    "/app/applet/src/app/globals.css": createClientReferenceDescriptor("(app-pages-browser)/./src/app/globals.css", CHUNKS.LAYOUT),
    "/app/applet/src/components/ui/toaster.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/components/ui/toaster.tsx", CHUNKS.LAYOUT),
    "/app/applet/src/app/error.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/app/error.tsx", CHUNKS.ERROR),
    "/app/applet/src/app/not-found.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/app/not-found.tsx", CHUNKS.NOT_FOUND),
    "/app/applet/src/components/PageClient.tsx": createClientReferenceDescriptor("(app-pages-browser)/./src/components/PageClient.tsx", CHUNKS.PAGE),

    // Next.js Runtime Client Internals
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
  // Client Reference Manifest Aggregation
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

  // ---------------------------------------------------------------------------
  // Global Manifest Registration (Safe Guarded & Error Resistant)
  // ---------------------------------------------------------------------------

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
    // Graceful degradation on immutable or restricted global contexts
  }
})();