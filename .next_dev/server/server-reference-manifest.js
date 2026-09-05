'use strict';

/**
 * Resolves the global execution context across different JavaScript environments (Browser, Worker, Node.js).
 * @returns {typeof globalThis | Window | WorkerGlobalScope | undefined} The global context object.
 */
function resolveGlobalContext() {
  if (typeof self !== 'undefined') {
    return self;
  }
  
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  
  return typeof window !== 'undefined' ? window : undefined;
}

(function initializeRscServerManifest() {
  const globalContext = resolveGlobalContext();

  if (!globalContext) {
    return;
  }

  const rscServerManifestPayload = {
    node: {},
    edge: {},
    encryptionKey: 'process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY',
  };

  globalContext.__RSC_SERVER_MANIFEST = JSON.stringify(rscServerManifestPayload);
})();