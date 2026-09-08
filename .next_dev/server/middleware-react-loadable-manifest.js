/**
 * @fileoverview EMG Core v49 Optimized React Loadable Manifest Middleware
 * @path .next_dev/server/middleware-react-loadable-manifest.js
 * @module ReactLoadableManifestOptimizer
 */

'use strict';

/**
 * @typedef {Object} ComponentManifestEntry
 * @property {string} id
 * @property {readonly string[]} files
 */

/**
 * @typedef {Object} ReactLoadableManifest
 * @property {Readonly<Record<string, Readonly<ComponentManifestEntry>>>} components
 */

/** @type {Readonly<ReactLoadableManifest>} */
const MANIFEST_DATA = Object.freeze({
  components: Object.freeze({
    "components/PageClient.tsx -> @/components/MainPage": Object.freeze({
      id: "components/PageClient.tsx -> @/components/MainPage",
      files: Object.freeze([
        "static/chunks/_app-pages-browser_src_components_MainPage_tsx.js"
      ])
    })
  })
});

/**
 * Caches the pre-serialized JSON string to eliminate runtime serialization overhead and maximize memory efficiency.
 * @type {string}
 */
const SERIALIZED_MANIFEST = JSON.stringify(MANIFEST_DATA);

/**
 * Resolves the global execution context across different runtimes (Node.js, Web Workers, Browsers).
 * @returns {Record<string, any>} The global target object.
 */
function resolveGlobalTarget() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  return {};
}

/**
 * Safely serializes and freezes the manifest assignment to ensure runtime integrity and immutability.
 * Incorporates robust error boundaries and strict execution context validation.
 * @returns {void}
 */
function initializeManifest() {
  const globalTarget = resolveGlobalTarget();

  try {
    Object.defineProperty(globalTarget, '__REACT_LOADABLE_MANIFEST', {
      value: SERIALIZED_MANIFEST,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (error) {
    try {
      globalTarget.__REACT_LOADABLE_MANIFEST = SERIALIZED_MANIFEST;
    } catch (fallbackError) {
      if (typeof console?.error === 'function') {
        console.error('[EMG Core v49] Critical failure initializing __REACT_LOADABLE_MANIFEST:', fallbackError);
      }
    }
  }
}

initializeManifest();