/**
 * Core RSC Reference Manifest Definition
 * File: .next_dev/server/app/api/setup/test-connection/route_client-reference-manifest.js
 * Role: Manages React Server Components (RSC) manifest routing for setup API endpoint.
 */

// Initialize global RSC Manifest store
globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};

const ROUTE_PATH = "/api/setup/test-connection/route";
const APP_PREFIX = "/app/applet";

const CHUNKS = Object.freeze({
  LAYOUT: ["app/layout", "static/chunks/app/layout.js"],
  ERROR: ["app/error", "static/chunks/app/error.js"],
  NOT_FOUND: ["app/not-found", "static/chunks/app/not-found.js"],
  PAGE: ["app/page", "static/chunks/app/page.js"],
  INTERNALS: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
});

const MODULE_LOADING_CONFIG = Object.freeze({
  prefix: "/_next/",
  crossOrigin: null,
});

const createModuleDescriptor = (scope, modulePath, chunks = []) => ({
  "*": {
    id: `(${scope})/.${modulePath}`,
    name: "*",
    chunks,
    async: false,
  },
});

const createClientModuleDescriptor = (modulePath, chunks) => ({
  id: `(app-pages-browser)/.${modulePath}`,
  name: "*",
  chunks,
  async: false,
});

const SSR_MODULE_PATHS = [
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
];

const RSC_MODULE_PATHS = [
  SSR_MODULE_PATHS[0],
  "/src/app/globals.css",
  ...SSR_MODULE_PATHS.slice(1),
];

const buildBrowserMapping = (paths, scope) =>
  Object.fromEntries(
    paths.map((path) => [
      `(app-pages-browser)/.${path}`,
      createModuleDescriptor(scope, path),
    ])
  );

const CLIENT_MODULE_DEFINITIONS = [
  { path: "/node_modules/next/dist/client/script.js", chunks: CHUNKS.LAYOUT, includeEsm: true },
  { path: "/src/app/globals.css", chunks: CHUNKS.LAYOUT },
  { path: "/src/components/ui/toaster.tsx", chunks: CHUNKS.LAYOUT },
  { path: "/src/app/error.tsx", chunks: CHUNKS.ERROR },
  { path: "/src/app/not-found.tsx", chunks: CHUNKS.NOT_FOUND },
  { path: "/src/components/PageClient.tsx", chunks: CHUNKS.PAGE },
  { path: "/node_modules/next/dist/client/components/client-page.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/client/components/client-segment.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/client/components/error-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/client/components/layout-router.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/client/components/render-from-template-context.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
  { path: "/node_modules/next/dist/lib/metadata/metadata-boundary.js", chunks: CHUNKS.INTERNALS, includeEsm: true },
];

const buildClientModulesMap = () => {
  const map = {};
  for (const { path, chunks, includeEsm } of CLIENT_MODULE_DEFINITIONS) {
    const descriptor = createClientModuleDescriptor(path, chunks);
    map[`${APP_PREFIX}${path}`] = descriptor;
    if (includeEsm) {
      const esmPath = path.replace("/node_modules/next/dist/", "/node_modules/next/dist/esm/");
      map[`${APP_PREFIX}${esmPath}`] = descriptor;
    }
  }
  return map;
};

const entryCSSFiles = {
  [`${APP_PREFIX}/src/`]: [],
  [`${APP_PREFIX}/src/app/layout`]: [{ inlined: false, path: "static/css/app/layout.css" }],
  [`${APP_PREFIX}/src/app/error`]: [],
  [`${APP_PREFIX}/src/app/not-found`]: [],
  [`${APP_PREFIX}/src/app/page`]: [],
  [`${APP_PREFIX}${ROUTE_PATH}`]: [],
};

globalThis.__RSC_MANIFEST[ROUTE_PATH] = {
  moduleLoading: MODULE_LOADING_CONFIG,
  ssrModuleMapping: buildBrowserMapping(SSR_MODULE_PATHS, "ssr"),
  edgeSSRModuleMapping: {},
  clientModules: buildClientModulesMap(),
  entryCSSFiles,
  rscModuleMapping: buildBrowserMapping(RSC_MODULE_PATHS, "rsc"),
  edgeRscModuleMapping: {},
};