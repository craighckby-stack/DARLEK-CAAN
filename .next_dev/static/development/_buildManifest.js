(function (globalContext) {
  "use strict";

  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  const buildManifest = {
    __rewrites: {
      afterFiles: [
        {
          has: undefined,
          source: "/:path((?!api|_next|static|favicon.ico).*)",
          destination: "/"
        }
      ],
      beforeFiles: [],
      fallback: []
    },
    __routerFilterStatic: undefined,
    __routerFilterDynamic: undefined,
    sortedPages: ["/_app"]
  };

  if (typeof Object.freeze === "function") {
    Object.freeze(buildManifest.__rewrites.afterFiles[0]);
    Object.freeze(buildManifest.__rewrites.afterFiles);
    Object.freeze(buildManifest.__rewrites);
    Object.freeze(buildManifest.sortedPages);
    Object.freeze(buildManifest);
  }

  try {
    Object.defineProperty(globalContext, "__BUILD_MANIFEST", {
      value: buildManifest,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch (_error) {
    globalContext.__BUILD_MANIFEST = buildManifest;
  }

  const cb = globalContext.__BUILD_MANIFEST_CB;
  if (typeof cb === "function") {
    try {
      cb();
    } catch (callbackError) {
      const consoleRef = typeof console !== "undefined" ? console : globalContext.console;
      if (consoleRef && typeof consoleRef.error === "function") {
        consoleRef.error("Error executing __BUILD_MANIFEST_CB callback:", callbackError);
      }
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);