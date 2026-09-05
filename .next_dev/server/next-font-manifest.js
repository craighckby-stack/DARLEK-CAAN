(function initializeNextFontManifest() {
  "use strict";

  const getGlobalScope = () => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return {};
  };

  const globalScope = getGlobalScope();
  const serializedManifest = '{"pages":{},"app":{},"appUsingSizeAdjust":false,"pagesUsingSizeAdjust":false}';
  const manifestSymbol = "__NEXT_FONT_MANIFEST";

  try {
    Object.defineProperty(globalScope, manifestSymbol, {
      value: serializedManifest,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } catch {
    globalScope[manifestSymbol] = serializedManifest;
  }
})();