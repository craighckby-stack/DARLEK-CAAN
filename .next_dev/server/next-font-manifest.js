(function () {
  "use strict";
  
  var globalScope = typeof globalThis !== "undefined"
    ? globalThis
    : typeof self !== "undefined"
      ? self
      : typeof window !== "undefined"
        ? window
        : typeof global !== "undefined"
          ? global
          : {};

  var manifestPayload = JSON.stringify(
    Object.freeze({
      pages: Object.freeze({}),
      app: Object.freeze({}),
      appUsingSizeAdjust: false,
      pagesUsingSizeAdjust: false
    })
  );

  try {
    Object.defineProperty(globalScope, "__NEXT_FONT_MANIFEST", {
      value: manifestPayload,
      writable: true,
      enumerable: true,
      configurable: true
    });
  } catch (e) {
    globalScope.__NEXT_FONT_MANIFEST = manifestPayload;
  }
})();