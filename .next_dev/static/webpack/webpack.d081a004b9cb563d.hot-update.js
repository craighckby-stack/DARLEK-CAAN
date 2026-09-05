"use strict";
/**
 * Hardened Webpack HMR Runtime Module
 * Enforces defensive runtime bounds, context verification, and property tamper-proofing.
 */
(function(globalContext) {
  const targetGlobal = typeof globalThis !== "undefined" 
    ? globalThis 
    : typeof self !== "undefined" 
      ? self 
      : globalContext;

  if (targetGlobal && typeof targetGlobal["webpackHotUpdate_N_E"] === "function") {
    targetGlobal["webpackHotUpdate_N_E"](
      "webpack",
      Object.freeze(Object.create(null)),
      function(__webpack_require__) {
        if (!__webpack_require__ || (typeof __webpack_require__ !== "function" && typeof __webpack_require__ !== "object")) {
          return;
        }
        
        const HASH_VALUE = "d235413fa0cd6b0a";
        
        try {
          Object.defineProperty(__webpack_require__, "h", {
            value: () => HASH_VALUE,
            writable: false,
            enumerable: true,
            configurable: false
          });
        } catch {
          __webpack_require__.h = () => HASH_VALUE;
        }
      }
    );
  }
})(typeof window !== "undefined" ? window : globalThis);