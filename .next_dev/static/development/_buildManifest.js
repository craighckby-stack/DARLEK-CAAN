(function (globalContext) {
  "use strict";

  if (!globalContext || (typeof globalContext !== "object" && typeof globalContext !== "function")) {
    return;
  }

  const isObjectOrFunction = (value) => value !== null && (typeof value === "object" || typeof value === "function");

  const deepFreeze = (targetObject) => {
    if (isObjectOrFunction(targetObject)) {
      Object.freeze(targetObject);
      const propertyNames = Object.getOwnPropertyNames(targetObject);
      for (const propName of propertyNames) {
        const propertyValue = targetObject[propName];
        if (isObjectOrFunction(propertyValue) && !Object.isFrozen(propertyValue)) {
          deepFreeze(propertyValue);
        }
      }
    }
    return targetObject;
  };

  const buildManifest = deepFreeze({
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
  });

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

  if (typeof globalContext.__BUILD_MANIFEST_CB === "function") {
    try {
      globalContext.__BUILD_MANIFEST_CB();
    } catch (callbackError) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("Error executing __BUILD_MANIFEST_CB callback:", callbackError);
      }
    }
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);