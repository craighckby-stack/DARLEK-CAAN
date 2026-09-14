/**
 * Core RSC Reference Manifest Definition
 * File: .next_dev/server/app/api/setup/test-connection/route_client-reference-manifest.js
 * Role: Manages React Server Components (RSC) manifest routing for setup API endpoint.
 * @module route_client-reference-manifest
 */

// Initialize global RSC Manifest store safely
if (typeof globalThis.__RSC_MANIFEST !== "object" || globalThis.__RSC_MANIFEST === null) {
  globalThis.__RSC_MANIFEST = {};
}

const ROUTE_PATH = "/api/setup/test-connection/route";
const APP_PREFIX = "/app/applet";

/** @type {Readonly<Record<string, readonly string[]>>} */
const CHUNKS = Object.freeze({
  LAYOUT: Object.freeze(["app/layout", "static/chunks/app/layout.js"]),
  ERROR: Object.freeze(["app/error", "static/chunks/app/error.js"]),
  NOT_FOUND: Object.freeze(["app/not-found", "static/chunks/app/not-found.js"]),
  PAGE: Object.freeze(["app/page", "static/chunks/app/page.js"]),
  INTERNALS: Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]),
});

/** @type {Readonly<{ prefix: string, crossOrigin: null | string }>} */
const MODULE_LOADING_CONFIG = Object.freeze({
  prefix: "/_next/",
  crossOrigin: null,
});

/**
 * Creates a server module descriptor.
 * @param {string} scope - Scope identifier ('ssr' | 'rsc')
 * @param {string} modulePath - Path to target module
 * @param {readonly string[]} [chunks=[]] - Associated chunk identifiers
 * @returns {Record<string, { id: string, name: string, chunks: readonly string[], async: boolean }>}
 */
const createModuleDescriptor = (scope, modulePath, chunks = []) =>
  Object.freeze({
    "*": Object.freeze({
      id: `(${scope})/.${modulePath}`,
      name: "*",
      chunks,
      async: false,
    }),
  });

/**
 * Creates a client module descriptor.
 * @param {string} modulePath - Path to client module
 * @param {readonly string[]} chunks - Associated chunk identifiers
 * @returns {{ id: string, name: string, chunks: readonly string[], async: boolean }}
 */
const createClientModuleDescriptor = (modulePath, chunks) =>
  Object.freeze({
    id: `(app-pages-browser)/.${modulePath}`,
    name: "*",
    chunks,
    async: false,
  });

/** @type {readonly string[]} */
const SSR_MODULE_PATHS = Object.freeze([
  "/node_modules/next/dist/client/script.js",
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
  "/node_modules/next/dist/lib/metadata/metadata-boundary.js",
]);

/** @type {readonly string[]} */
const RSC_MODULE_PATHS = Object.freeze([
  SSR_MODULE_PATHS[0],
  "/src/app/globals.css",
  ...SSR_MODULE_PATHS.slice(1),
]);

/**
 * Builds browser module mapping for a specific RSC/SSR scope.
 * @param {readonly string[]} paths - List of module paths
 * @param {string} scope - Evaluation scope ('ssr' | 'rsc')
 * @returns {Record<string, ReturnType<typeof createModuleDescriptor>>}
 */
const buildBrowserMapping = (paths, scope) => {
  const mapping = Object.create(null);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    mapping[`(app-pages-browser)/.${path}`] = createModuleDescriptor(scope, path);
  }
  return Object.freeze(mapping);
};

/** @type {readonly Array<{ path: string, chunks: readonly string[], includeEsm?: boolean }>} */
const CLIENT_MODULE_DEFINITIONS = Object.freeze([
  Object.freeze({ path: "/node_modules/next/dist/client/script.js", chunks: CHUNKS.LAYOUT, includeEsm: true }),
  Object.freeze({ path: "/src/app/globals.css", chunks: CHUNKS.LAYOUT }),
  Object.freeze({ path: "/src/components/ui/toaster.tsx", chunks: CHUNKS.LAYOUT }),
  Object.freeze({ path: "/src/app/error.tsx", chunks: CHUNKS.ERROR }),
  Object.freeze({ path: "/src/app/not-found.tsx", chunks: CHUNKS.NOT_FOUND }),
  Object.freeze({ path: "/src/components/PageClient.tsx", chunks: CHUNKS.PAGE }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/client-page.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/client-segment.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/error-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/layout-router.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/client/components/render-from-template-context.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
  Object.freeze({ path: "/node_modules/next/dist/lib/metadata/metadata-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true }),
]);

/**
 * Compiles the client modules dictionary.
 * @returns {Record<string, ReturnType<typeof createClientModuleDescriptor>>}
 */
const buildClientModulesMap = () => {
  const map = Object.create(null);
  for (let i = 0; i < CLIENT_MODULE_DEFINITIONS.length; i++) {
    const { path, chunks, includeEsm } = CLIENT_MODULE_DEFINITIONS[i];
    const descriptor = createClientModuleDescriptor(path, chunks);
    map[`${APP_PREFIX}${path}`] = descriptor;
    if (includeEsm) {
      const esmPath = path.replace("/node_modules/next/dist/", "/node_modules/next/dist/esm/");
      map[`${APP_PREFIX}${esmPath}`] = descriptor;
    }
  }
  return Object.freeze(map);
};

const entryCSSFiles = Object.freeze({
  [`${APP_PREFIX}/src/`]: Object.freeze([]),
  [`${APP_PREFIX}/src/app/layout`]: Object.freeze([{ inlined: false, path: "static/css/app/layout.css" }]),
  [`${APP_PREFIX}/src/app/error`]: Object.freeze([]),
  [`${APP_PREFIX}/src/app/not-found`]: Object.freeze([]),
  [`${APP_PREFIX}/src/app/page`]: Object.freeze([]),
  [`${APP_PREFIX}${ROUTE_PATH}`]: Object.freeze([]),
});

// Register manifest entry with immutability guarantees
globalThis.__RSC_MANIFEST[ROUTE_PATH] = Object.freeze({
  moduleLoading: MODULE_LOADING_CONFIG,
  ssrModuleMapping: buildBrowserMapping(SSR_MODULE_PATHS, "ssr"),
  edgeSSRModuleMapping: Object.freeze({}),
  clientModules: buildClientModulesMap(),
  entryCSSFiles,
  rscModuleMapping: buildBrowserMapping(RSC_MODULE_PATHS, "rsc"),
  edgeRscModuleMapping: Object.freeze({}),
});