"use strict";

/**
 * Hardened Webpack HMR Runtime Module
 * Enforces defensive runtime bounds, context verification, and property tamper-proofing.
 */
(function initializeWebpackHmrRuntime(fallbackGlobalContext) {
  const resolveTargetGlobal = () => {
    if (typeof globalThis !== "undefined") return globalThis;
    if (typeof self !== "undefined") return self;
    return fallbackGlobalContext;
  };

  const targetGlobal = resolveTargetGlobal();
  const hmrUpdateFunction = targetGlobal?.["webpackHotUpdate_N_E"];

  if (typeof hmrUpdateFunction !== "function") {
    return;
  }

  const MODULE_NAME = "webpack";
  const EMPTY_FROZEN_MODULES = Object.freeze(Object.create(null));
  const TARGET_HASH_VALUE = "d235413fa0cd6b0a";

  const injectModuleHashGetter = (webpackRequire) => {
    if (!webpackRequire || (typeof webpackRequire !== "function" && typeof webpackRequire !== "object")) {
      return;
    }

    const hashDescriptor = {
      value: () => TARGET_HASH_VALUE,
      writable: false,
      enumerable: true,
      configurable: false,
    };

    try {
      Object.defineProperty(webpackRequire, "h", hashDescriptor);
    } catch {
      webpackRequire.h = hashDescriptor.value;
    }
  };

  hmrUpdateFunction(MODULE_NAME, EMPTY_FROZEN_MODULES, injectModuleHashGetter);
})(typeof window !== "undefined" ? window : globalThis);