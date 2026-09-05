(function initializeNextFontManifest() {
  "use strict";

  const globalScope = 
    typeof globalThis !== "undefined" ? globalThis :
    typeof self !== "undefined" ? self :
    typeof window !== "undefined" ? window :
    typeof global !== "undefined" ? global : {};

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