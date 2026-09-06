(function initializeNextFontManifest() {
  "use strict";

  const g = typeof globalThis !== "undefined" 
    ? globalThis 
    : typeof window !== "undefined" 
      ? window 
      : typeof global !== "undefined" 
        ? global 
        : self;

  const m = '{"pages":{},"app":{},"appUsingSizeAdjust":false,"pagesUsingSizeAdjust":false}';
  const s = "__NEXT_FONT_MANIFEST";

  try {
    Object.defineProperty(g, s, {
      value: m,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch {
    g[s] = m;
  }
})();