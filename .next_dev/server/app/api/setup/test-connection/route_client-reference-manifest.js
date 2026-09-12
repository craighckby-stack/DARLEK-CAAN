/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: .next_dev/server/app/api/setup/test-connection/route_client-reference-manifest.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

// Initialize global RSC Manifest repository if not already present
globalThis.__RSC_MANIFEST = globalThis.__RSC_MANIFEST || {};

const ROUTE_PATH = "/api/setup/test-connection/route";

// Shared chunk reference definitions
const CHUNKS = {
  LAYOUT: ["app/layout", "static/chunks/app/layout.js"],
  ERROR: ["app/error", "static/chunks/app/error.js"],
  NOT_FOUND: ["app/not-found", "static/chunks/app/not-found.js"],
  PAGE: ["app/page", "static/chunks/app/page.js"],
  INTERNALS: ["app-pages-internals", "static/chunks/app-pages-internals.js"],
};

const MODULE_LOADING_CONFIG = {
  prefix: "/_next/",
  crossOrigin: null,
};

const createSsrMapping = (modulePath) => ({
  "*": {
    id: `(ssr)/.${modulePath}`,
    name: "*",
    chunks: [],
    async: false,
  },
});

const createRscMapping = (modulePath) => ({
  "*": {
    id: `(rsc)/.${modulePath}`,
    name: "*",
    chunks: [],
    async: false,
  },
});

const createClientModuleDescriptor = (modulePath, chunks) => ({
  id: `(app-pages-browser)/.${modulePath}`,
  name: "*",
  chunks,
  async: false,
});

const ssrModuleMapping = {
  "(app-pages-browser)/./node_modules/next/dist/client/script.js": createSsrMapping("/node_modules/next/dist/client/script.js"),
  "(app-pages-browser)/./src/components/ui/toaster.tsx": createSsrMapping("/src/components/ui/toaster.tsx"),
  "(app-pages-browser)/./src/app/error.tsx": createSsrMapping("/src/app/error.tsx"),
  "(app-pages-browser)/./src/app/not-found.tsx": createSsrMapping("/src/app/not-found.tsx"),
  "(app-pages-browser)/./src/components/PageClient.tsx": createSsrMapping("/src/components/PageClient.tsx"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createSsrMapping("/node_modules/next/dist/client/components/client-page.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createSsrMapping("/node_modules/next/dist/client/components/client-segment.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createSsrMapping("/node_modules/next/dist/client/components/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createSsrMapping("/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createSsrMapping("/node_modules/next/dist/client/components/layout-router.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createSsrMapping("/node_modules/next/dist/client/components/render-from-template-context.js"),
  "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createSsrMapping("/node_modules/next/dist/lib/metadata/metadata-boundary.js"),
};

const rscModuleMapping = {
  "(app-pages-browser)/./node_modules/next/dist/client/script.js": createRscMapping("/node_modules/next/dist/client/script.js"),
  "(app-pages-browser)/./src/app/globals.css": createRscMapping("/src/app/globals.css"),
  "(app-pages-browser)/./src/components/ui/toaster.tsx": createRscMapping("/src/components/ui/toaster.tsx"),
  "(app-pages-browser)/./src/app/error.tsx": createRscMapping("/src/app/error.tsx"),
  "(app-pages-browser)/./src/app/not-found.tsx": createRscMapping("/src/app/not-found.tsx"),
  "(app-pages-browser)/./src/components/PageClient.tsx": createRscMapping("/src/components/PageClient.tsx"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-page.js": createRscMapping("/node_modules/next/dist/client/components/client-page.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/client-segment.js": createRscMapping("/node_modules/next/dist/client/components/client-segment.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/error-boundary.js": createRscMapping("/node_modules/next/dist/client/components/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createRscMapping("/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/layout-router.js": createRscMapping("/node_modules/next/dist/client/components/layout-router.js"),
  "(app-pages-browser)/./node_modules/next/dist/client/components/render-from-template-context.js": createRscMapping("/node_modules/next/dist/client/components/render-from-template-context.js"),
  "(app-pages-browser)/./node_modules/next/dist/lib/metadata/metadata-boundary.js": createRscMapping("/node_modules/next/dist/lib/metadata/metadata-boundary.js"),
};

const clientModules = {
  "/app/applet/node_modules/next/dist/client/script.js": createClientModuleDescriptor("/node_modules/next/dist/client/script.js", CHUNKS.LAYOUT),
  "/app/applet/node_modules/next/dist/esm/client/script.js": createClientModuleDescriptor("/node_modules/next/dist/client/script.js", CHUNKS.LAYOUT),
  "/app/applet/src/app/globals.css": createClientModuleDescriptor("/src/app/globals.css", CHUNKS.LAYOUT),
  "/app/applet/src/components/ui/toaster.tsx": createClientModuleDescriptor("/src/components/ui/toaster.tsx", CHUNKS.LAYOUT),
  "/app/applet/src/app/error.tsx": createClientModuleDescriptor("/src/app/error.tsx", CHUNKS.ERROR),
  "/app/applet/src/app/not-found.tsx": createClientModuleDescriptor("/src/app/not-found.tsx", CHUNKS.NOT_FOUND),
  "/app/applet/src/components/PageClient.tsx": createClientModuleDescriptor("/src/components/PageClient.tsx", CHUNKS.PAGE),
  "/app/applet/node_modules/next/dist/client/components/client-page.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/client-page.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/client-page.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/client-page.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/client/components/client-segment.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/client-segment.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/client-segment.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/client-segment.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/client/components/error-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/error-boundary.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/error-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/error-boundary.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/http-access-fallback/error-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/http-access-fallback/error-boundary.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/client/components/layout-router.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/layout-router.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/layout-router.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/layout-router.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/client/components/render-from-template-context.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/render-from-template-context.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/client/components/render-from-template-context.js": createClientModuleDescriptor("/node_modules/next/dist/client/components/render-from-template-context.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/lib/metadata/metadata-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/lib/metadata/metadata-boundary.js", CHUNKS.INTERNALS),
  "/app/applet/node_modules/next/dist/esm/lib/metadata/metadata-boundary.js": createClientModuleDescriptor("/node_modules/next/dist/lib/metadata/metadata-boundary.js", CHUNKS.INTERNALS),
};

const entryCSSFiles = {
  "/app/applet/src/": [],
  "/app/applet/src/app/layout": [{ inlined: false, path: "static/css/app/layout.css" }],
  "/app/applet/src/app/error": [],
  "/app/applet/src/app/not-found": [],
  "/app/applet/src/app/page": [],
  "/app/applet/src/app/api/setup/test-connection/route": [],
};

globalThis.__RSC_MANIFEST[ROUTE_PATH] = {
  moduleLoading: MODULE_LOADING_CONFIG,
  ssrModuleMapping,
  edgeSSRModuleMapping: {},
  clientModules,
  entryCSSFiles,
  rscModuleMapping,
  edgeRscModuleMapping: {},
};