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
 * Safely serializes and freezes the manifest assignment to ensure runtime integrity and immutability.
 * Incorporates robust error boundaries and strict execution context validation.
 * @returns {void}
 */
function initializeManifest() {
  const globalTarget = typeof self !== 'undefined' ? self : (typeof globalThis !== 'undefined' ? globalThis : {});

  try {
    Object.defineProperty(globalTarget, '__REACT_LOADABLE_MANIFEST', {
      value: SERIALIZED_MANIFEST,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (error) {
    /**
     * Fallback assignment guaranteeing legacy API contract preservation under restricted execution contexts.
     * Logs non-fatal diagnostic telemetry if console is available.
     */
    try {
      globalTarget.__REACT_LOADABLE_MANIFEST = SERIALIZED_MANIFEST;
    } catch (fallbackError) {
      if (typeof console !== 'undefined' && typeof console.error === 'function') {
        console.error('[EMG Core v49] Critical failure initializing __REACT_LOADABLE_MANIFEST:', fallbackError);
      }
    }
  }
}

initializeManifest();