(function initializeMiddlewareBuildManifest() {
  "use strict";

  const globalScope =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof self !== "undefined"
      ? self
      : typeof window !== "undefined"
      ? window
      : {};

  function resolveBuildId() {
    try {
      const rawBuildId = typeof process !== "undefined" && process && process.env ? process.env.__NEXT_BUILD_ID : undefined;

      if (typeof rawBuildId !== "string" || rawBuildId === "") {
        return "development";
      }

      const isSafeIdentifier = /^[a-zA-Z0-9_\-]+$/.test(rawBuildId);
      return isSafeIdentifier ? rawBuildId : encodeURIComponent(rawBuildId);
    } catch {
      return "development";
    }
  }

  const buildId = resolveBuildId();
  const staticAssetBasePath = "/static/" + buildId + "/";

  const buildManifest = Object.freeze({
    polyfillFiles: Object.freeze(["static/chunks/polyfills.js"]),
    devFiles: Object.freeze([]),
    ampDevFiles: Object.freeze([]),
    lowPriorityFiles: Object.freeze([
      staticAssetBasePath + "_buildManifest.js",
      staticAssetBasePath + "_ssgManifest.js"
    ]),
    rootMainFiles: Object.freeze([
      "static/chunks/webpack.js",
      "static/chunks/main-app.js"
    ]),
    rootMainFilesTree: Object.freeze({}),
    pages: Object.freeze({
      "/_app": Object.freeze([])
    }),
    ampFirstPages: Object.freeze([])
  });

  try {
    if (globalScope && typeof globalScope === "object") {
      Object.defineProperty(globalScope, "__BUILD_MANIFEST", {
        value: buildManifest,
        writable: true,
        configurable: true,
        enumerable: true
      });
    }
  } catch {
    // Fail silently if global scope property assignment is restricted
  }
})();