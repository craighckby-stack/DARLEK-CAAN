"use strict";

(function initializeWebpackChunk(globalScope) {
  if (!globalScope) {
    return;
  }

  const WEBPACK_CHUNK_KEY = "webpackChunk_N_E";
  const chunkRegistry = (globalScope[WEBPACK_CHUNK_KEY] ??= []);

  const CLIENT_LOADER_MODULE_ID =
    "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=false!";

  const moduleRegistry = Object.freeze(
    Object.assign(Object.create(null), {
      [CLIENT_LOADER_MODULE_ID]: Object.freeze(function clientEntryStub() {
        "use strict";
      }),
    })
  );

  const MAIN_APP_DEPENDENCIES = Object.freeze(["main-app"]);
  const ROUTE_IDENTIFIER = Object.freeze(["app/api/brain/route"]);

  const runtimeBootstrap = function bootstrapWebpackRuntime(webpackRequire) {
    if (typeof webpackRequire !== "function") {
      return;
    }

    if (typeof webpackRequire.O === "function") {
      webpackRequire.O(0, MAIN_APP_DEPENDENCIES, () => {
        webpackRequire.s = CLIENT_LOADER_MODULE_ID;
        return webpackRequire(CLIENT_LOADER_MODULE_ID);
      });

      const chunkExports = webpackRequire.O();
      globalScope._N_E = chunkExports;
      return chunkExports;
    }
  };

  chunkRegistry.push(
    Object.freeze([
      ROUTE_IDENTIFIER,
      moduleRegistry,
      runtimeBootstrap,
    ])
  );
})(
  typeof self !== "undefined"
    ? self
    : typeof globalThis !== "undefined"
    ? globalThis
    : this
);