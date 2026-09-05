"use strict";

/**
 * Initializes and registers the Next.js Flight client-side entry chunk 
 * for the API brain route within the global Webpack chunk registry.
 */
(function initializeWebpackChunk(globalScope) {
  if (!globalScope || typeof globalScope !== "object") {
    return;
  }

  const WEBPACK_CHUNK_KEY = "webpackChunk_N_E";
  const chunkRegistry = (globalScope[WEBPACK_CHUNK_KEY] ??= []);

  const CLIENT_LOADER_MODULE_ID =
    "(app-pages-browser)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=false!";

  const moduleRegistry = Object.freeze(
    Object.assign(Object.create(null), {
      [CLIENT_LOADER_MODULE_ID]: Object.freeze(function clientEntryStub(
        _unusedModule,
        _unusedExports,
        _webpackRequire
      ) {
        "use strict";
        // Client-side flight entry point stub - secured execution boundary
      }),
    })
  );

  const runtimeBootstrap = function bootstrapWebpackRuntime(webpackRequire) {
    if (typeof webpackRequire !== "function") {
      return undefined;
    }

    const executeModule = function executeModuleById(targetId) {
      if (typeof targetId !== "string" || targetId.length === 0) {
        return undefined;
      }
      return webpackRequire((webpackRequire.s = targetId));
    };

    if (typeof webpackRequire.O === "function") {
      webpackRequire.O(0, Object.freeze(["main-app"]), () =>
        executeModule(CLIENT_LOADER_MODULE_ID)
      );
      
      const chunkExports = webpackRequire.O();
      globalScope._N_E = chunkExports;
      return chunkExports;
    }

    return undefined;
  };

  chunkRegistry.push(
    Object.freeze([
      Object.freeze(["app/api/brain/route"]),
      moduleRegistry,
      runtimeBootstrap,
    ])
  );
})(typeof self !== "undefined" ? self : typeof globalThis !== "undefined" ? globalThis : this);