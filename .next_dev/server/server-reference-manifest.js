'use strict';

/**
 * Resolves the global execution context across different JavaScript environments with zero allocation overhead.
 * @returns {typeof globalThis | undefined} The global context object.
 */
function resolveGlobalContext() {
  if (typeof globalThis !== 'undefined') return globalThis;
  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  return void 0;
}

/**
 * Initializes the React Server Components (RSC) server manifest on the global execution context.
 */
!(function initializeRscServerManifest() {
  const globalContext = resolveGlobalContext();
  if (globalContext && globalContext.__RSC_SERVER_MANIFEST === void 0) {
    globalContext.__RSC_SERVER_MANIFEST = '{"node":{},"edge":{},"encryptionKey":"process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY"}';
  }
})();