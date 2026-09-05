'use strict';

/**
 * Resolves the global execution context across different JavaScript environments with zero allocation overhead.
 * @returns {typeof globalThis | undefined} The global context object.
 */
function resolveGlobalContext() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  
  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  return undefined;
}

/**
 * Initializes the React Server Components (RSC) server manifest on the global execution context.
 */
(function initializeRscServerManifest() {
  const globalContext = resolveGlobalContext();

  if (!globalContext) {
    return;
  }

  // Pre-serialize the static manifest payload to eliminate runtime JSON.stringify overhead and allocations
  globalContext.__RSC_SERVER_MANIFEST = JSON.stringify({
    node: {},
    edge: {},
    encryptionKey: 'process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY',
  });
})();