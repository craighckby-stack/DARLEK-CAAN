/**
 * ARCHITECTURAL HEADER
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Role: RSC Client Reference Manifest registration for the '/page' route.
 * Architecture: Clean, modular initialization of Next.js server/client component mappings.
 */

// Defensive initialization of global RSC manifest store
try {
  if (typeof globalThis === "undefined") {
    throw new Error("Global environment context (globalThis) is unavailable.");
  }
  globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};
} catch (error) {
  console.error("[RSC Manifest Error] Failed to access global manifest store:", error);
}

/**
 * Shared frozen empty array to optimize memory allocations across module mappings.
 * @type {readonly string[]}
 */
const EMPTY_CHUNKS = Object.freeze([]);

/**
 * @typedef {Object} ClientModuleEntry
 * @property {string} id - Target module reference identifier.
 * @property {string} name - Module export name.
 * @property {readonly string[]} chunks - Associated bundle chunk paths.
 * @property {boolean} async - Asynchronous load indicator.
 */

/**
 * Creates a standard RSC module reference entry object.
 * @param {string} id - Target module reference identifier.
 * @returns {Record<string, ClientModuleEntry>}
 */
const createModuleMappingEntry = (id) =>
  Object.freeze({
    "*": Object.freeze({
      id,
      name: "*",
      chunks: EMPTY_CHUNKS,
      async: false,
    }),
  });

/**
 * Creates a client module definition object.
 * @param {string} id - Browser module specifier identifier.
 * @param {readonly string[]} chunks - Associated bundle chunk paths.
 * @returns {ClientModuleEntry}
 */
const createClientModuleEntry = (id, chunks) =>
  Object.freeze({
    id,
    name: "*",
    chunks: Object.freeze([...chunks]),
    async: false,
  });

// Target module relative paths shared between SSR and RSC mappings
const ssrRelativePaths = Object.freeze([
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
]);

const rscRelativePaths = Object.freeze([
  "./node_modules/next/dist/client/script.js",
  "./src/app/globals.css",
  ...ssrRelativePaths.slice(1),
]);

/**
 * Builds module mapping records for the specified environment scope.
 * @param {readonly string[]} relativePaths - List of component paths.
 * @param {'ssr' | 'rsc'} envScope - Execution environment scope ('ssr' | 'rsc').
 * @returns {Record<string, Record<string, ClientModuleEntry>>}
 */
const buildEnvironmentMapping = (relativePaths, envScope) => {
  /** @type {Record<string, Record<string, ClientModuleEntry>>} */
  const mapping = {};
  for (let i = 0; i < relativePaths.length; i += 1) {
    const relativePath = relativePaths[i];
    mapping[`(app-pages-browser)/${relativePath}`] = createModuleMappingEntry(`(${envScope})/${relativePath}`);
  }
  return Object.freeze(mapping);
};

// Bundle Chunk Definitions
const LAYOUT_CHUNKS = Object.freeze(["app/layout", "static/chunks/app/layout.js"]);
const INTERNAL_CHUNKS = Object.freeze(["app-pages-internals", "static/chunks/app-pages-internals.js"]);

// Shared Internal Next.js Component Subpaths
const INTERNAL_COMPONENT_SUBPATHS = Object.freeze([
  "client/components/client-page.js",
  "client/components/client-segment.js",
  "client/components/error-boundary.js",
  "client/components/http-access-fallback/error-boundary.js",
  "client/components/layout-router.js",
  "client/components/render-from-template-context.js",
  "lib/metadata/metadata-boundary.js",
]);

/** @type {Record<string, ClientModuleEntry>} */
const clientModules = {
  // Script & Layout Assets
  "/app/applet/node_modules/next/dist/client/script.js": createClientModuleEntry("(app-pages-browser)/./node_modules/next/dist/client/script.js", LAYOUT_CHUNKS),
  "/app/applet/node_modules/next/dist/esm/client/script.js": createClientModuleEntry("(app-pages-browser)/./node_modules/next/dist/client/script.js", LAYOUT_CHUNKS),
  "/app/applet/src/app/globals.css": createClientModuleEntry("(app-pages-browser)/./src/app/globals.css", LAYOUT_CHUNKS),
  "/app/applet/src/components/ui/toaster.tsx": createClientModuleEntry("(app-pages-browser)/./src/components/ui/toaster.tsx", LAYOUT_CHUNKS),

  // Route-Specific Application Components
  "/app/applet/src/app/error.tsx": createClientModuleEntry("(app-pages-browser)/./src/app/error.tsx", Object.freeze(["app/error", "static/chunks/app/error.js"])),
  "/app/applet/src/app/not-found.tsx": createClientModuleEntry("(app-pages-browser)/./src/app/not-found.tsx", Object.freeze(["app/not-found", "static/chunks/app/not-found.js"])),
  "/app/applet/src/components/PageClient.tsx": createClientModuleEntry("(app-pages-browser)/./src/components/PageClient.tsx", Object.freeze(["app/page", "static/chunks/app/page.js"])),
};

// Programmatically register internal Next.js components (CJS and ESM formats)
for (let i = 0; i < INTERNAL_COMPONENT_SUBPATHS.length; i += 1) {
  const subpath = INTERNAL_COMPONENT_SUBPATHS[i];
  const browserId = `(app-pages-browser)/./node_modules/next/dist/${subpath}`;
  clientModules[`/app/applet/node_modules/next/dist/${subpath}`] = createClientModuleEntry(browserId, INTERNAL_CHUNKS);
  clientModules[`/app/applet/node_modules/next/dist/esm/${subpath}`] = createClientModuleEntry(browserId, INTERNAL_CHUNKS);
}

Object.freeze(clientModules);

/**
 * Entry CSS Specification Mapping
 */
const entryCSSFiles = Object.freeze({
  "/app/applet/src/": Object.freeze([]),
  "/app/applet/src/app/layout": Object.freeze([
    Object.freeze({
      inlined: false,
      path: "static/css/app/layout.css",
    }),
  ]),
  "/app/applet/src/app/error": Object.freeze([]),
  "/app/applet/src/app/not-found": Object.freeze([]),
  "/app/applet/src/app/page": Object.freeze([]),
});

// Register page client reference manifest entry for '/page'
if (globalThis.__RSC_MANIFEST) {
  globalThis.__RSC_MANIFEST["/page"] = Object.freeze({
    moduleLoading: Object.freeze({
      prefix: "/_next/",
      crossOrigin: null,
    }),
    ssrModuleMapping: buildEnvironmentMapping(ssrRelativePaths, "ssr"),
    edgeSSRModuleMapping: Object.freeze({}),
    clientModules,
    entryCSSFiles,
    rscModuleMapping: buildEnvironmentMapping(rscRelativePaths, "rsc"),
    edgeRscModuleMapping: Object.freeze({}),
  });
}