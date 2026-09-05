'use strict';

/**
 * Resolves the universal global execution context safely across diverse runtimes.
 * @returns {typeof globalThis | Window | NodeJS.Global | unknown} The resolved global object.
 */
function resolveGlobalScope() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  return this;
}

/**
 * Initializes and registers the Static Site Generation (SSG) manifest on the global context.
 */
(function initializeSsgManifest() {
  const globalScope = resolveGlobalScope();

  const isInvalidScope = !globalScope || (typeof globalScope !== 'object' && typeof globalScope !== 'function');
  if (isInvalidScope) {
    return;
  }

  try {
    const ManifestContainer = typeof Set === 'function' ? Set : Array;
    
    Object.defineProperty(globalScope, '__SSG_MANIFEST', {
      value: new ManifestContainer(),
      writable: true,
      enumerable: true,
      configurable: true
    });

    const initializationCallback = globalScope.__SSG_MANIFEST_CB;
    if (typeof initializationCallback === 'function') {
      Reflect.apply(initializationCallback, globalScope, []);
    }
  } catch {
    // Gracefully contain volatile execution and prevent unhandled runtime errors
  }
})();