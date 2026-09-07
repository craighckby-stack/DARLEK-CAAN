/**
 * @fileoverview EMG Core v49 Optimized React Loadable Manifest Middleware
 * @path .next_dev/server/middleware-react-loadable-manifest.js
 * @module ReactLoadableManifestOptimizer
 */

'use strict';

/**
 * @type {Readonly<{
 *   readonly components: Readonly<{
 *     readonly [key: string]: Readonly<{
 *       readonly id: string;
 *       readonly files: readonly string[];
 *     }>;
 *   }>;
 * }>}
 */
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
 * Safely serializes and freezes the manifest assignment to ensure runtime integrity and immutability.
 * @throws {TypeError} If assignment to global self fails under strict mode constraints.
 */
function initializeManifest() {
  try {
    const serializedManifest = JSON.stringify(MANIFEST_DATA);
    
    Object.defineProperty(self, '__REACT_LOADABLE_MANIFEST', {
      value: serializedManifest,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (error) {
    // Fallback assignment guaranteeing legacy API contract preservation under restricted execution contexts
    self.__REACT_LOADABLE_MANIFEST = '{"components/PageClient.tsx -> @/components/MainPage":{"id":"components/PageClient.tsx -> @/components/MainPage","files":["static/chunks/_app-pages-browser_src_components_MainPage_tsx.js"]}}';
  }
}

initializeManifest();