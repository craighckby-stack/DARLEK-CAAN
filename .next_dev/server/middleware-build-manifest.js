(function initializeMiddlewareBuildManifest() {
  "use strict";

  const globalScope = 
    typeof self !== "undefined" ? self : 
    typeof globalThis !== "undefined" ? globalThis : 
    this;

  const sanitizeBuildId = (rawId) => 
    /^[a-zA-Z0-9_\-]+$/.test(rawId) ? rawId : encodeURIComponent(rawId);

  const resolveBuildId = () => {
    const environmentBuildId = process?.env?.__NEXT_BUILD_ID;
    return typeof environmentBuildId === "string" 
      ? sanitizeBuildId(environmentBuildId) 
      : "development";
  };

  const currentBuildId = resolveBuildId();

  globalScope.__BUILD_MANIFEST = {
    polyfillFiles: [
      "static/chunks/polyfills.js"
    ],
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