/**
 * ARCHITECTURAL HEADER
 * File: .next_dev/server/app/page_client-reference-manifest.js
 * Role: RSC Client Reference Manifest registration for the '/page' route.
 * Architecture: Clean, modular initialization of Next.js server/client component mappings.
 */

// Initialize global RSC manifest store if not present
globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};

/**
 * Shared helper to create a default module reference entry.
 * @param {string} id - Target module ID
 * @returns {Record<string, {id: string, name: string, chunks: Array, async: boolean}>}
 */
const createModuleMappingEntry = (id) => ({
  "*": {
    id,
    name: "*",
    chunks: [],
    async: false,
  },
});

/**
 * Server-Side Rendering (SSR) Module Mapping
 */
const ssrModuleMapping = {
  "(app-pages-browser)/./node_modules/next/dist/client/script.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/script.js"),
  "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleMappingEntry("(ssr)/./src/components/ui/toaster.tsx"),
  "(app-pages-browser)/./src/app/error.tsx": createModuleMappingEntry("(ssr)/./src/app/error.tsx"),
  "(app-pages-browser)/./src/app/not-found.tsx": createModuleMappingEntry("(ssr)/./src/app/not-found.tsx"),
  "(app-pages-browser)/./src/components/PageClient.tsx": createModuleMappingEntry("(ssr)/./src/components/PageClient.tsx"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/client-page.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/client-segment.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/layout-router.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/client/components/render-from-template-context.js"),
  "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleMappingEntry("(ssr)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
};

/**
 * React Server Components (RSC) Module Mapping
 */
const rscModuleMapping = {
  "(app-pages-browser)/./node_modules/next/dist/client/script.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/script.js"),
  "(app-pages-browser)/./src/app/globals.css": createModuleMappingEntry("(rsc)/./src/app/globals.css"),
  "(app-pages-browser)/./src/components/ui/toaster.tsx": createModuleMappingEntry("(rsc)/./src/components/ui/toaster.tsx"),
  "(app-pages-browser)/./src/app/error.tsx": createModuleMappingEntry("(rsc)/./src/app/error.tsx"),
  "(app-pages-browser)/./src/app/not-found.tsx": createModuleMappingEntry("(rsc)/./src/app/not-found.tsx"),
  "(app-pages-browser)/./src/components/PageClient.tsx": createModuleMappingEntry("(rsc)/./src/components/PageClient.tsx"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/client-page.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/client-segment.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/layout-router.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/client/components/render-from-template-context.js"),
  "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createModuleMappingEntry("(rsc)/./node_modules/next/dist/lib/metadata/metadata-boundary.js"),
};

/**
 * Client Bundle Module Definitions
 */
const layoutChunks = ["app/layout", "static/chunks/app/layout.js"];
const internalChunks = ["app-pages-internals", "static/chunks/app-pages-internals.js"];

const clientModules = {
  "/app/applet/node_modules/next/dist/client/script.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/script.js",
    name: "*",
    chunks: layoutChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/script.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/script.js",
    name: "*",
    chunks: layoutChunks,
    async: false,
  },
  "/app/applet/src/app/globals.css": {
    id: "(app-pages-browser)/./src/app/globals.css",
    name: "*",
    chunks: layoutChunks,
    async: false,
  },
  "/app/applet/src/components/ui/toaster.tsx": {
    id: "(app-pages-browser)/./src/components/ui/toaster.tsx",
    name: "*",
    chunks: layoutChunks,
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
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/client/components/client-segment.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/client/components/error-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/client/components/layout-router.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
  "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": {
    id: "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js",
    name: "*",
    chunks: internalChunks,
    async: false,
  },
};

/**
 * Entry CSS File Specifications
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

// Register page client reference manifest for '/page'
globalThis.__RSC_MANIFEST["/page"] = {
  moduleLoading: {
    prefix: "/_next/",
    crossOrigin: null,
  },
  ssrModuleMapping,
  edgeSSRModuleMapping: {},
  clientModules,
  entryCSSFiles,
  rscModuleMapping,
  edgeRscModuleMapping: {},
};