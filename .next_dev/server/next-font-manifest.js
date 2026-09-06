(function initializeNextFontManifest() {
  "use strict";

  const MANIFEST_GLOBAL_KEY = "__NEXT_FONT_MANIFEST";

  const DEFAULT_FONT_MANIFEST = JSON.stringify({
    pages: {},
    app: {},
    appUsingSizeAdjust: false,
    pagesUsingSizeAdjust: false
  });

  function resolveGlobalScope() {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    if (typeof self !== "undefined") return self;
    return Function("return this")();
  }

  function registerGlobalManifest(targetScope, propertyKey, manifestPayload) {
    try {
      Object.defineProperty(targetScope, propertyKey, {
        value: manifestPayload,
        writable: true,
        enumerable: true,
        configurable: true
      });
    } catch {
      targetScope[propertyKey] = manifestPayload;
    }
  }

  const globalScope = resolveGlobalScope();
  registerGlobalManifest(globalScope, MANIFEST_GLOBAL_KEY, DEFAULT_FONT_MANIFEST);
})();