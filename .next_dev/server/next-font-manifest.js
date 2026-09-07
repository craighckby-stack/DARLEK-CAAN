(function initializeNextFontManifest() {
  "use strict";

  /** @type {const} */
  const MANIFEST_GLOBAL_KEY = "__NEXT_FONT_MANIFEST";

  /** @type {Readonly<{pages: Record<string, unknown>, app: Record<string, unknown>, appUsingSizeAdjust: boolean, pagesUsingSizeAdjust: boolean}>} */
  const DEFAULT_FONT_MANIFEST = {
    pages: {},
    app: {},
    appUsingSizeAdjust: false,
    pagesUsingSizeAdjust: false
  };

  /**
   * Resolves the global execution context safely across diverse JavaScript environments.
   * @returns {typeof globalThis} The resolved global execution object.
   */
  function resolveGlobalScope() {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    if (typeof self !== "undefined") return self;
    
    try {
      const indirectEval = (0, eval);
      return indirectEval("this");
    } catch {
      return {};
    }
  }

  /**
   * Safely defines a property on the target scope with descriptor fallback protection.
   * @param {Record<string, any>} targetScope The target global scope object.
   * @param {string} propertyKey The property key to define.
   * @param {unknown} manifestPayload The value payload to assign.
   */
  function registerGlobalManifest(targetScope, propertyKey, manifestPayload) {
    if (!targetScope || (typeof targetScope !== "object" && typeof targetScope !== "function")) {
      return;
    }

    try {
      Object.defineProperty(targetScope, propertyKey, {
        value: manifestPayload,
        writable: true,
        enumerable: false,
        configurable: true
      });
    } catch {
      try {
        targetScope[propertyKey] = manifestPayload;
      } catch {
        // Fail gracefully if target scope is entirely immutable or sealed
      }
    }
  }

  const globalScope = resolveGlobalScope();
  registerGlobalManifest(globalScope, MANIFEST_GLOBAL_KEY, DEFAULT_FONT_MANIFEST);
})();