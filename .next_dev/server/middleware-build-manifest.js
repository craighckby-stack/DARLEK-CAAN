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
      const rawBuildId = typeof process !== "undefined" ? process?.env?.__NEXT_BUILD_ID : undefined;

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
  const staticAssetBasePath = `/static/${buildId}/`;

  const buildManifest = {
    polyfillFiles: ["static/chunks/polyfills.js"],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [
      `${staticAssetBasePath}_buildManifest.js`,
      `${staticAssetBasePath}_ssgManifest.js`
    ],
    rootMainFiles: [
      "static/chunks/webpack.js",
      "static/chunks/main-app.js"
    ],
    rootMainFilesTree: {},
    pages: {
      "/_app": []
    },
    ampFirstPages: []
  };

  try {
    globalScope.__BUILD_MANIFEST = buildManifest;
  } catch {
    // Fail silently if global scope property assignment is restricted
  }
})();