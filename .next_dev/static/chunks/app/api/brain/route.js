"use strict";

(function (globalScope) {
  if (typeof globalScope !== "object" || globalScope === null) {
    return;
  }

  const chunkKey = "webpackChunk_N_E";
  const chunkRegistry = Array.isArray(globalScope[chunkKey])
    ? globalScope[chunkKey]
    : (globalScope[chunkKey] = []);

  const clientLoaderModuleId =
    "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=false!";

  const moduleMap = Object.create(null);
  moduleMap[clientLoaderModuleId] = Object.freeze(function (
    __unused_webpack_module,
    __unused_webpack_exports,
    __webpack_require__
  ) {
    "use strict";
    // Client-side flight entry point stub - secured execution boundary
  });

  const runtimeBootstrap = function (__webpack_require__) {
    "use strict";
    if (typeof __webpack_require__ !== "function") {
      return undefined;
    }

    const __webpack_exec__ = function (targetId) {
      if (typeof targetId !== "string" || targetId.length === 0) {
        return undefined;
      }
      return __webpack_require__((__webpack_require__.s = targetId));
    };

    if (typeof __webpack_require__.O === "function") {
      __webpack_require__.O(0, Object.freeze(["main-app"]), function () {
        return __webpack_exec__(clientLoaderModuleId);
      });
      const __webpack_exports__ = __webpack_require__.O();
      globalScope._N_E = __webpack_exports__;
      return __webpack_exports__;
    }

    return undefined;
  };

  chunkRegistry.push([
    Object.freeze(["app/api/brain/route"]),
    Object.freeze(moduleMap),
    runtimeBootstrap
  ]);
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);