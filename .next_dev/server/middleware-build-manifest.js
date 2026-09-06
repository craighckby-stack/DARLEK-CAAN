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
    const rawBuildId = typeof process !== "undefined" ? process?.env?.__NEXT_BUILD_ID : undefined;

    if (typeof rawBuildId !== "string") {
      return "development";
    }

    const isSafeIdentifier = /^[a-zA-Z0-9_\-]+$/.test(rawBuildId);
    return isSafeIdentifier ? rawBuildId : encodeURIComponent(rawBuildId);
  }

  const buildId = resolveBuildId();
  const staticAssetBasePath = `/static/${buildId}/`;

  globalScope.__BUILD_MANIFEST = {
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
})();