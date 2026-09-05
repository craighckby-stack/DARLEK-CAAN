(function initializeMiddlewareBuildManifest() {
  "use strict";

  const globalScope = 
    typeof globalThis !== "undefined" ? globalThis : 
    typeof self !== "undefined" ? self : 
    this;

  const BUILD_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

  const currentBuildId = (() => {
    const rawId = process?.env?.__NEXT_BUILD_ID;
    if (typeof rawId === "string") {
      return BUILD_ID_REGEX.test(rawId) ? rawId : encodeURIComponent(rawId);
    }
    return "development";
  })();

  const lowPriorityFiles = [
    `/static/${currentBuildId}/_buildManifest.js`,
    `/static/${currentBuildId}/_ssgManifest.js`
  ];

  globalScope.__BUILD_MANIFEST = {
    polyfillFiles: ["static/chunks/polyfills.js"],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles,
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