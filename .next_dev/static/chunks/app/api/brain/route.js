"use strict";

/**
 * @fileoverview EMG Core v49 Optimized Webpack Route Chunk for app/api/brain/route.
 * @module .next_dev/static/chunks/app/api/brain/route
 */

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

  /**
   * Optimized immutable client entry point stub definition.
   * @type {() => void}
   */
  const clientEntryStub = Object.freeze(function clientEntryStub() {
    "use strict";
  });

  /**
   * Null-prototype dictionary of registered modules ensuring zero prototype pollution.
   * @type {Readonly<Record<string, () => void>>}
   */
  const moduleRegistry = Object.freeze(
    Object.assign(Object.create(null), {
      [FLIGHT_CLIENT_LOADER_ID]: clientEntryStub,
    })
  );

  /**
   * Bootstraps the route chunk within the Webpack runtime environment with enhanced type-checking and error-safety.
   *
   * @param {((id: string | number) => unknown) & { O: (chunkId?: number | string, deps?: string[], callback?: () => unknown) => unknown; s?: string | number }} webpackRequire - Webpack module resolution runtime function.
   * @returns {unknown} The evaluated chunk exports, or undefined if requirements fail.
   */
  const bootstrapRouteRuntime = function bootstrapWebpackRuntime(webpackRequire) {
    if (typeof webpackRequire !== "function" || typeof webpackRequire.O !== "function") {
      return;
    }

    try {
      // Register dependency satisfaction callback safely
      webpackRequire.O(0, MAIN_APP_DEPENDENCIES, () => {
        webpackRequire.s = FLIGHT_CLIENT_LOADER_ID;
        return webpackRequire(FLIGHT_CLIENT_LOADER_ID);
      });

      const routeExports = webpackRequire.O();
      globalScope._N_E = routeExports;
      return routeExports;
    } catch (error) {
      if (typeof console !== "undefined" && typeof console.error === "function") {
        console.error("[EMG Core v49] Failed to bootstrap route chunk runtime:", error);
      }
      return undefined;
    }
  };

  // Safely attach chunk definition to the global Webpack queue
  const chunkRegistry = (globalScope[WEBPACK_CHUNK_REGISTRY_KEY] ??= []);
  if (Array.isArray(chunkRegistry)) {
    chunkRegistry.push([
      ROUTE_CHUNK_IDENTIFIERS,
      moduleRegistry,
      bootstrapRouteRuntime,
    ]);
  }
})(
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
    ? self
    : typeof window !== "undefined"
    ? window
    : this
);