(function() {
  "use strict";

  var targetScope = typeof self !== "undefined" ? self : (typeof globalThis !== "undefined" ? globalThis : this);

  var getSafeBuildId = function() {
    if (typeof process !== "undefined" && process && process.env && typeof process.env.__NEXT_BUILD_ID === "string") {
      var rawId = process.env.__NEXT_BUILD_ID;
      if (/^[a-zA-Z0-9_\-]+$/.test(rawId)) {
        return rawId;
      }
      return encodeURIComponent(rawId);
    }
    return "development";
  };

  var safeBuildId = getSafeBuildId();

  targetScope.__BUILD_MANIFEST = {
    "polyfillFiles": [
      "static/chunks/polyfills.js"
    ],
    "devFiles": [],
    "ampDevFiles": [],
    "lowPriorityFiles": [
      "/static/" + safeBuildId + "/_buildManifest.js",
      "/static/" + safeBuildId + "/_ssgManifest.js"
    ],
    "rootMainFiles": [
      "static/chunks/webpack.js",
      "static/chunks/main-app.js"
    ],
    "rootMainFilesTree": {},
    "pages": {
      "/_app": []
    },
    "ampFirstPages": []
  };
})();