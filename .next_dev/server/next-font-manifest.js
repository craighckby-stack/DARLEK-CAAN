(function initializeNextFontManifest() {
  "use strict";

  const getGlobalScope = () => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    if (typeof window !== "undefined") return window;
    if (typeof global !== "undefined") return global;
    return {};
  };

  const fontManifest = Object.freeze({
    pages: Object.freeze({}),
    app: Object.freeze({}),
    appUsingSizeAdjust: false,
    pagesUsingSizeAdjust: false,
  });

  const serializedManifest = JSON.stringify(fontManifest);
  const globalScope = getGlobalScope();
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