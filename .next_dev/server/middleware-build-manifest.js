(function initializeMiddlewareBuildManifest() {
  "use strict";

  const g = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
  const b = typeof process !== "undefined" && process?.env?.__NEXT_BUILD_ID;
  const id = typeof b === "string" ? (/^[a-zA-Z0-9_\-]+$/.test(b) ? b : encodeURIComponent(b)) : "development";
  const s = `/static/${id}/`;

  g.__BUILD_MANIFEST = {
    polyfillFiles: ["static/chunks/polyfills.js"],
    devFiles: [],
    ampDevFiles: [],
    lowPriorityFiles: [s + "_buildManifest.js", s + "_ssgManifest.js"],
    rootMainFiles: ["static/chunks/webpack.js", "static/chunks/main-app.js"],
    rootMainFilesTree: {},
    pages: { "/_app": [] },
    ampFirstPages: []
  };
})();