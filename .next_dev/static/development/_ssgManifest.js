'use strict';

/**
 * Resolves the universal global execution context safely across diverse runtimes.
 * @returns {typeof globalThis | Window | NodeJS.Global | unknown} The resolved global object.
 */
function resolveGlobalScope() {
  return typeof globalThis !== 'undefined' ? globalThis
    : typeof self !== 'undefined' ? self
    : typeof window !== 'undefined' ? window
    : typeof global !== 'undefined' ? global
    : this;
}

/**
 * Initializes and registers the Static Site Generation (SSG) manifest on the global context.
 */
(function initializeSsgManifest() {
  const globalScope = resolveGlobalScope();

  if (!globalScope || (typeof globalScope !== 'object' && typeof globalScope !== 'function')) {
    return;
  }

  try {
    Object.defineProperty(globalScope, '__SSG_MANIFEST', {
      value: new (typeof Set === 'function' ? Set : Array)(),
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