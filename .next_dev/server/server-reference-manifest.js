'use strict';

/**
 * Resolves the global execution context across different JavaScript environments with zero allocation overhead.
 * @internal
 * @returns {typeof globalThis | undefined} The global context object.
 */
function resolveGlobalContext() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  return void 0;
}

/**
 * Initializes the React Server Components (RSC) server manifest on the global execution context securely and idempotently.
 */
!(function initializeRscServerManifest() {
  try {
    const globalContext = resolveGlobalContext();
    if (globalContext !== void 0 && globalContext.__RSC_SERVER_MANIFEST === void 0) {
      Object.defineProperty(globalContext, '__RSC_SERVER_MANIFEST', {
        value: '{"node":{},"edge":{},"encryptionKey":"process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY"}',
        writable: false,
        enumerable: false,
        configurable: true
      });
    }
  } catch {
    // Fail silently in restricted sandbox environments to maintain execution stability
  }
})();