/**
 * ARCHITECTURAL HEADER
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Role: RSC Client Reference Manifest registration for the '/page' route.
 * Architecture: Clean, modular initialization of Next.js server/client component mappings.
 */

// Initialize global RSC manifest store if not present
globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};

/**
 * Creates a standard RSC module reference entry object.
 * @param {string} id - Target module reference identifier.
 * @returns {Record<string, { id: string, name: string, chunks: Array<string>, async: boolean }>}
 */
const createModuleMappingEntry = (id) => ({
  "*": { id, name: "*", chunks: [], async: false },
});

/**
 * Creates a client module definition object.
 * @param {string} id - Browser module specifier identifier.
 * @param {string[]} chunks - Associated bundle chunk paths.
 * @returns {{ id: string, name: string, chunks: string[], async: boolean }}
 */
const createClientModuleEntry = (id, chunks) => ({
  id,
  name: "*",
  chunks,
  async: false,
});

// Target module relative paths shared between SSR and RSC mappings
const ssrRelativePaths = [
  "./node_modules/next/dist/client/script.js",
  "./src/components/ui/toaster.tsx",
  "./src/app/error.tsx",
  "./src/app/not-found.tsx",
  "./src/components/PageClient.tsx",
  "./node_modules/next/dist/client/components/client-page.js",
  "./node_modules/next/dist/client/components/client-segment.js",
  "./node_modules/next/dist/client/components/error-boundary.js",
  "./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
  "./node_modules/next/dist/client/components/layout-router.js",
  "./node_modules/next/dist/client/components/render-from-template-context.js",
  "./node_modules/next/dist/lib/metadata/metadata-boundary.js",
];

const rscRelativePaths = [
  "./node_modules/next/dist/client/script.js",
  "./src/app/globals.css",
  ...ssrRelativePaths.slice(1),
];

/**
 * Builds module mapping records for the specified environment scope.
 * @param {string[]} relativePaths - List of component paths.
 * @param {string} envScope - Execution environment scope ('ssr' | 'rsc').
 * @returns {Record<string, Record<string, { id: string, name: string, chunks: string[], async: boolean }>>}
 */
const buildEnvironmentMapping = (relativePaths, envScope) =>
  Object.fromEntries(
    relativePaths.map((relativePath) => [
      `(app-pages-browser)/${relativePath}`,
      createModuleMappingEntry(`(${envScope})/${relativePath}`),
    ])
  );

// Bundle Chunk Definitions
const LAYOUT_CHUNKS = ["app/layout", "static/chunks/app/layout.js"];
const INTERNAL_CHUNKS = ["app-pages-internals", "static/chunks/app-pages-internals.js"];

// Shared Internal Next.js Component Subpaths
const INTERNAL_COMPONENT_SUBPATHS = [
  "client/components/client-page.js",
  "client/components/client-segment.js",
  "client/components/error-boundary.js",
  "client/components/http-access-fallback/error-boundary.js",
  "client/components/layout-router.js",
  "client/components/render-from-template-context.js",
  "lib/metadata/metadata-boundary.js",
];

const clientModules = {
  // Script & Layout Assets
  "/app/applet/node_modules/next/dist/client/script.js": createClientModuleEntry("(app-pages-browser)/./node_modules/next/dist/client/script.js", LAYOUT_CHUNKS),
  "/app/applet/node_modules/next/dist/esm/client/script.js": createClientModuleEntry("(app-pages-browser)/./node_modules/next/dist/client/script.js", LAYOUT_CHUNKS),
  "/app/applet/src/app/globals.css": createClientModuleEntry("(app-pages-browser)/./src/app/globals.css", LAYOUT_CHUNKS),
  "/app/applet/src/components/ui/toaster.tsx": createClientModuleEntry("(app-pages-browser)/./src/components/ui/toaster.tsx", LAYOUT_CHUNKS),

  // Route-Specific Application Components
  "/app/applet/src/app/error.tsx": createClientModuleEntry("(app-pages-browser)/./src/app/error.tsx", ["app/error", "static/chunks/app/error.js"]),
  "/app/applet/src/app/not-found.tsx": createClientModuleEntry("(app-pages-browser)/./src/app/not-found.tsx", ["app/not-found", "static/chunks/app/not-found.js"]),
  "/app/applet/src/components/PageClient.tsx": createClientModuleEntry("(app-pages-browser)/./src/components/PageClient.tsx", ["app/page", "static/chunks/app/page.js"]),
};

// Programmatically register internal Next.js components (CJS and ESM formats)
INTERNAL_COMPONENT_SUBPATHS.forEach((subpath) => {
  const browserId = `(app-pages-browser)/./node_modules/next/dist/${subpath}`;
  clientModules[`/app/applet/node_modules/next/dist/${subpath}`] = createClientModuleEntry(browserId, INTERNAL_CHUNKS);
  clientModules[`/app/applet/node_modules/next/dist/esm/${subpath}`] = createClientModuleEntry(browserId, INTERNAL_CHUNKS);
});

/**
 * Entry CSS Specification Mapping
 */
const entryCSSFiles = {
  "/app/applet/src/": [],
  "/app/applet/src/app/layout": [
    {
      inlined: false,
      path: "static/css/app/layout.css",
    },
  ],
  "/app/applet/src/app/error": [],
  "/app/applet/src/app/not-found": [],
  "/app/applet/src/app/page": [],
};

// Register page client reference manifest entry for '/page'
globalThis.__RSC_MANIFEST["/page"] = {
  moduleLoading: {
    prefix: "/_next/",
    crossOrigin: null,
  },
  ssrModuleMapping: buildEnvironmentMapping(ssrRelativePaths, "ssr"),
  edgeSSRModuleMapping: {},
  clientModules,
  entryCSSFiles,
  rscModuleMapping: buildEnvironmentMapping(rscRelativePaths, "rsc"),
  edgeRscModuleMapping: {},
};