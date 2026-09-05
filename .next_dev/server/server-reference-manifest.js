'use strict';

/**
 * Resolves the global execution context across different JavaScript environments with zero allocation overhead.
 * @returns {typeof globalThis | undefined} The global context object.
 */
function resolveGlobalContext() {
  return typeof globalThis !== 'undefined' 
    ? globalThis 
    : (typeof self !== 'undefined' 
        ? self 
        : (typeof window !== 'undefined' ? window : undefined));
}

(function initializeRscServerManifest() {
  const globalContext = resolveGlobalContext();

  if (globalContext === undefined) {
    return;
  }

  // Pre-serialize the static manifest payload to eliminate runtime JSON.stringify overhead and allocations
  globalContext.__RSC_SERVER_MANIFEST = '{"node":{},"edge":{},"encryptionKey":"process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY"}';
})();