"use strict";

(function initializeRouteChunk(globalScope) {
  if (!globalScope) {
    return;
  }

  // Webpack chunk registration identifiers
  const WEBPACK_CHUNK_REGISTRY_KEY = "webpackChunk_N_E";
  const MAIN_APP_DEPENDENCIES = Object.freeze(["main-app"]);
  const ROUTE_CHUNK_IDENTIFIERS = Object.freeze(["app/api/brain/route"]);

  const FLIGHT_CLIENT_LOADER_ID =
    "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=false!";

  // Client entry point stub definition
  const clientEntryStub = Object.freeze(function clientEntryStub() {
    "use strict";
  });

  // Null-prototype dictionary of registered modules
  const moduleRegistry = Object.freeze(
    Object.assign(Object.create(null), {
      [FLIGHT_CLIENT_LOADER_ID]: clientEntryStub,
    })
  );

  /**
   * Bootstraps the route chunk within the Webpack runtime environment.
   *
   * @param {Function} webpackRequire - Webpack module resolution runtime function.
   * @returns {unknown} The evaluated chunk exports.
   */
  const bootstrapRouteRuntime = function bootstrapWebpackRuntime(webpackRequire) {
    if (typeof webpackRequire !== "function" || typeof webpackRequire.O !== "function") {
      return;
    }

    // Register dependency satisfaction callback
    webpackRequire.O(0, MAIN_APP_DEPENDENCIES, () => {
      webpackRequire.s = FLIGHT_CLIENT_LOADER_ID;
      return webpackRequire(FLIGHT_CLIENT_LOADER_ID);
    });

    const routeExports = webpackRequire.O();
    globalScope._N_E = routeExports;
    return routeExports;
  };

  // Attach chunk definition to the global Webpack queue
  const chunkRegistry = (globalScope[WEBPACK_CHUNK_REGISTRY_KEY] ??= []);
  chunkRegistry.push([
    ROUTE_CHUNK_IDENTIFIERS,
    moduleRegistry,
    bootstrapRouteRuntime,
  ]);
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : this
);