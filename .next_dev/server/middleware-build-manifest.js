(function initializeMiddlewareBuildManifest() {
  "use strict";

  const globalScope = typeof globalThis !== "undefined" 
    ? globalThis 
    : (typeof self !== "undefined" ? self : (typeof window !== "undefined" ? window : {}));

  const rawBuildId = typeof process !== "undefined" && process?.env?.__NEXT_BUILD_ID;
  const currentBuildId = typeof rawBuildId === "string" && /^[a-zA-Z0-9_\-]+$/.test(rawBuildId)
    ? rawBuildId
    : (typeof rawBuildId === "string" ? encodeURIComponent(rawBuildId) : "development");

  globalScope.__BUILD_MANIFEST = {
    polyfillFiles: ["static/chunks/polyfills.js"],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [
      `/static/${currentBuildId}/_buildManifest.js`,
      `/static/${currentBuildId}/_ssgManifest.js`
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