"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * Route Client Reference Manifest Registrar for: /api/brain/route
 *
 * Provides structured, immutable registration of React Server Components (RSC)
 * client reference manifests and chunk mappings across runtime targets.
 */
(() => {
  const ROUTE_IDENTIFIER = "/api/brain/route";
  const ASSET_PREFIX = "/_next/";
  const APPLET_ROOT = "/app/applet";

  const CHUNKS_LAYOUT = Object.freeze(["app/layout", "static/chunks/app/layout.js"]);
  const CHUNKS_ERROR = Object.freeze(["app/error", "static/chunks/app/error.js"]);
  const CHUNKS_NOT_FOUND = Object.freeze(["app/not-found", "static/chunks/app/not-found.js"]);
  const CHUNKS_PAGE = Object.freeze(["app/page", "static/chunks/app/page.js"]);
  const CHUNKS_APP_PAGES_INTERNALS = Object.freeze([
    "app-pages-internals",
    "static/chunks/app-pages-internals.js"
  ]);

  const EMPTY_CHUNKS = Object.freeze([]);

  /**
   * Resolves the ambient global scope container across diverse JS environments.
   * @returns {typeof globalThis | null}
   */
  const resolveGlobalScope = () => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return null;
  };

  /**
   * Factory for creating immutable module descriptor records.
   * @param {string} id Module identifier
   * @param {readonly string[]} [chunks] Array of dependent chunk paths
   * @param {boolean} [isAsync] Whether the module requires async resolution
   * @param {string} [exportName] Targeted export symbol name
   */
  const createModuleDescriptor = (
    id,
    chunks = EMPTY_CHUNKS,
    isAsync = false,
    exportName = "*"
  ) =>
    Object.freeze({
      id,
      name: exportName,
      chunks,
      async: isAsync
    });

  /**
   * Factory for creating wildcard-keyed export mapping records.
   * @param {string} targetId Target module ID for the mapping
   */
  const createWildcardMapping = (targetId) =>
    Object.freeze({
      "*": createModuleDescriptor(targetId, EMPTY_CHUNKS, false)
    });

  /**
   * Constructs the SSR/RSC module mapping dictionaries.
   * @param {"ssr" | "rsc"} environmentTag
   * @param {readonly string[]} relativePaths
   */
  const buildModuleMapping = (environmentTag, relativePaths) => {
    const mappingEntries = relativePaths.map((relativePath) => {
      const browserModuleKey = `(app-pages-browser)/.${relativePath}`;
      const targetModuleId = `(${environmentTag})/.${relativePath}`;
      return [browserModuleKey, createWildcardMapping(targetModuleId)];
    });

    return Object.freeze(Object.fromEntries(mappingEntries));
  };

  const ssrSharedPaths = [
    "/src/components/ui/toaster.tsx",
    "/src/app/error.tsx",
    "/src/app/not-found.tsx",
    "/src/components/PageClient.tsx",
    "/node_modules/next/dist/client/components/client-page.js",
    "/node_modules/next/dist/client/components/client-segment.js",
    "/node_modules/next/dist/client/components/error-boundary.js",
    "/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
    "/node_modules/next/dist/client/components/layout-router.js",
    "/node_modules/next/dist/client/components/render-from-template-context.js",
    "/node_modules/next/dist/lib/metadata/metadata-boundary.js"
  ];

  const rscSharedPaths = [
    "/src/app/globals.css",
    ...ssrSharedPaths
  ];

  const ssrModuleMapping = buildModuleMapping("ssr", ssrSharedPaths);
  const rscModuleMapping = buildModuleMapping("rsc", rscSharedPaths);

  const clientModules = Object.freeze({
    [`${APPLET_ROOT}/src/app/globals.css`]: createModuleDescriptor(
      "(app-pages-browser)/./src/app/globals.css",
      CHUNKS_LAYOUT
    ),
    [`${APPLET_ROOT}/src/components/ui/toaster.tsx`]: createModuleDescriptor(
      "(app-pages-browser)/./src/components/ui/toaster.tsx",
      CHUNKS_LAYOUT
    ),
    [`${APPLET_ROOT}/src/app/error.tsx`]: createModuleDescriptor(
      "(app-pages-browser)/./src/app/error.tsx",
      CHUNKS_ERROR
    ),
    [`${APPLET_ROOT}/src/app/not-found.tsx`]: createModuleDescriptor(
      "(app-pages-browser)/./src/app/not-found.tsx",
      CHUNKS_NOT_FOUND
    ),
    [`${APPLET_ROOT}/src/components/PageClient.tsx`]: createModuleDescriptor(
      "(app-pages-browser)/./src/components/PageClient.tsx",
      CHUNKS_PAGE
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/client-page.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/client-page.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/client-segment.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/client-segment.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/error-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/error-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/layout-router.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/layout-router.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/client/components/render-from-template-context.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/client/components/render-from-template-context.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/lib/metadata/metadata-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    ),
    [`${APPLET_ROOT}/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js`]: createModuleDescriptor(
      "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js",
      CHUNKS_APP_PAGES_INTERNALS
    )
  });

  const entryCSSFiles = Object.freeze({
    [`${APPLET_ROOT}/src/`]: EMPTY_CHUNKS,
    [`${APPLET_ROOT}/src/app/layout`]: Object.freeze([
      Object.freeze({ inlined: false, path: "static/css/app/layout.css" })
    ]),
    [`${APPLET_ROOT}/src/app/error`]: EMPTY_CHUNKS,
    [`${APPLET_ROOT}/src/app/not-found`]: EMPTY_CHUNKS,
    [`${APPLET_ROOT}/src/app/page`]: EMPTY_CHUNKS,
    [`${APPLET_ROOT}/src/app/api/brain/route`]: EMPTY_CHUNKS
  });

  const clientReferenceManifest = Object.freeze({
    moduleLoading: Object.freeze({
      prefix: ASSET_PREFIX,
      crossOrigin: null
    }),
    ssrModuleMapping,
    edgeSSRModuleMapping: Object.freeze({}),
    clientModules,
    entryCSSFiles,
    rscModuleMapping,
    edgeRscModuleMapping: Object.freeze({})
  });

  const globalScope = resolveGlobalScope();
  if (!globalScope) return;

  const manifestStore = (globalScope.__RSC_MANIFEST ??= Object.create(null));
  manifestStore[ROUTE_IDENTIFIER] = clientReferenceManifest;
})();