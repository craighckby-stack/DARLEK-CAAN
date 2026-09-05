(function initializeMiddlewareBuildManifest() {
  "use strict";

  const resolveGlobalScope = () => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    return typeof window !== "undefined" ? window : {};
  };

  const globalScope = resolveGlobalScope();
  const BUILD_ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

  const determineCurrentBuildId = () => {
    const rawBuildId = process?.env?.__NEXT_BUILD_ID;
    
    if (typeof rawBuildId === "string") {
      return BUILD_ID_REGEX.test(rawBuildId) 
        ? rawBuildId 
        : encodeURIComponent(rawBuildId);
    }
    
    return "development";
  };

  const currentBuildId = determineCurrentBuildId();

  const lowPriorityFiles = [
    `/static/${currentBuildId}/_buildManifest.js`,
    `/static/${currentBuildId}/_ssgManifest.js`
  ];

  const buildManifest = {
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

  globalScope.__BUILD_MANIFEST = buildManifest;
})();