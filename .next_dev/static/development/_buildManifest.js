(function (globalContext) {
  "use strict";

  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  var deepFreeze = function (obj) {
    if (obj !== null && (typeof obj === "object" || typeof obj === "function")) {
      Object.freeze(obj);
      var propNames = Object.getOwnPropertyNames(obj);
      for (var i = 0; i < propNames.length; i++) {
        var prop = obj[propNames[i]];
        if (prop !== null && (typeof prop === "object" || typeof prop === "function") && !Object.isFrozen(prop)) {
          deepFreeze(prop);
        }
      }
    }
    return obj;
  };

  var buildManifest = deepFreeze({
    __rewrites: {
      afterFiles: [
        {
          has: void 0,
          source: "/:path((?!api|_next|static|favicon.ico).*)",
          destination: "/"
        }
      ],
      beforeFiles: [],
      fallback: []
    },
    __routerFilterStatic: void 0,
    __routerFilterDynamic: void 0,
    sortedPages: ["/_app"]
  });

  try {
    Object.defineProperty(globalContext, "__BUILD_MANIFEST", {
      value: buildManifest,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch (_e) {
    globalContext.__BUILD_MANIFEST = buildManifest;
  }

  if (typeof globalContext.__BUILD_MANIFEST_CB === "function") {
    try {
      globalContext.__BUILD_MANIFEST_CB();
    } catch (cbError) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("Error executing __BUILD_MANIFEST_CB callback:", cbError);
      }
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);