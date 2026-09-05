(function initializeBuildManifest(globalContext) {
  "use strict";

  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  const DEFAULT_CATCH_ALL_ROUTE = {
    has: undefined,
    source: "/:path((?!api|_next|static|favicon.ico).*)",
    destination: "/"
  };

  const buildManifest = {
    __rewrites: {
      afterFiles: [DEFAULT_CATCH_ALL_ROUTE],
      beforeFiles: [],
      fallback: []
    },
    __routerFilterStatic: undefined,
    __routerFilterDynamic: undefined,
    sortedPages: ["/_app"]
  };

  const deepFreeze = (targetObject) => {
    if (typeof Object.freeze === "function" && targetObject && typeof targetObject === "object") {
      Object.freeze(targetObject);
      Object.getOwnPropertyNames(targetObject).forEach((propertyName) => {
        const propertyValue = targetObject[propertyName];
        if (propertyValue && typeof propertyValue === "object") {
          deepFreeze(propertyValue);
        }
      });
    }
    return targetObject;
  };

  deepFreeze(buildManifest);

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

  const manifestCallback = globalContext.__BUILD_MANIFEST_CB;
  if (typeof manifestCallback === "function") {
    try {
      manifestCallback();
    } catch (callbackError) {
      const consoleReference = globalContext.console;
      if (consoleReference && typeof consoleReference.error === "function") {
        consoleReference.error("Error executing __BUILD_MANIFEST_CB callback:", callbackError);
      }
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);