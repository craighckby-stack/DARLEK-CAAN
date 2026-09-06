'use strict';

/**
 * Resolves the universal global execution context safely across diverse runtimes.
 * @returns {typeof globalThis} The resolved global object.
 */
function resolveGlobalScope() {
  return typeof globalThis === 'undefined'
    ? (typeof self === 'undefined'
        ? (typeof window === 'undefined'
            ? (typeof global === 'undefined' ? this : global)
            : window)
        : self)
    : globalThis;
}

/**
 * Initializes and registers the Static Site Generation (SSG) manifest on the global context.
 */
(function initializeSsgManifest() {
  const globalScope = resolveGlobalScope();

  if (globalScope === null || (typeof globalScope !== 'object' && typeof globalScope !== 'function')) {
    return;
  }

  try {
    Object.defineProperty(globalScope, '__SSG_MANIFEST', {
      value: typeof Set === 'function' ? new Set() : [],
      writable: true,
      enumerable: true,
      configurable: true
    });

    const manifestCallback = globalScope.__SSG_MANIFEST_CB;
    if (typeof manifestCallback === 'function') {
      manifestCallback.call(globalScope);
    }
  } catch {}
})();