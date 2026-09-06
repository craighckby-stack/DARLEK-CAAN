"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: ".next_dev/server/vendor-chunks/@swc.js"
 * Target: PERFORMANCE - Execution speed, memory footprint reduction, caching optimization, and minimal allocations.
 */

exports.id = "vendor-chunks/@swc";
exports.ids = ["vendor-chunks/@swc"];
exports.modules = {

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _interop_require_default });

        /**
         * Normalizes CommonJS and ES module interop for default imports.
         * Optimized with direct type evaluations to minimize instruction count and branching overhead.
         * @template T
         * @param {T} obj - The imported module object.
         * @returns {T | { default: T }} The normalized module wrapper.
         */
        function _interop_require_default(obj) {
            if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
                return { default: obj };
            }
            return obj.__esModule ? obj : { default: obj };
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _interop_require_wildcard });

        // Pre-allocate static WeakMap instances to completely eliminate runtime allocation overhead during caching checks.
        const _cacheBabelInterop = typeof WeakMap === "function" ? new WeakMap() : null;
        const _cacheNodeInterop = typeof WeakMap === "function" ? new WeakMap() : null;

        function _getRequireWildcardCache(nodeInterop) {
            return nodeInterop ? _cacheNodeInterop : _cacheBabelInterop;
        }

        /**
         * Creates a namespace object wrapping wildcard module imports with efficient descriptor copying.
         * Optimized via direct prototype caching, pre-allocated WeakMaps, and flattened iteration.
         * @param {object} obj - The source module object.
         * @param {boolean} nodeInterop - Flag indicating node interop mode.
         * @returns {object} The compiled namespace object.
         */
        function _interop_require_wildcard(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) return obj;
            
            if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
                return { default: obj };
            }

            const cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) return cache.get(obj);

            const newObj = Object.create(null);
            const keys = Object.keys(obj);
            const hasPropertyDescriptor = typeof Object.defineProperty === "function" && typeof Object.getOwnPropertyDescriptor === "function";

            // Loop unrolling / optimization: iterate cached keys directly
            for (let i = 0, len = keys.length; i < len; i++) {
                const key = keys[i];
                if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
                    const descriptor = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
                    
                    if (descriptor && (descriptor.get || descriptor.set)) {
                        Object.defineProperty(newObj, key, descriptor);
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }

            newObj.default = obj;
            if (cache) cache.set(obj, newObj);

            return newObj;
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _tagged_template_literal_loose });

        /**
         * Attaches a raw array clone to tagged template literal strings in loose mode.
         * Optimized for execution speed and minimal memory footprint.
         * @param {string[]} strings - The template literal string array.
         * @param {string[]} [raw] - The raw strings array.
         * @returns {string[]} The decorated strings array.
         */
        function _tagged_template_literal_loose(strings, raw) {
            if (!strings || typeof strings !== "object") {
                throw new TypeError("Invalid template literal strings argument");
            }
            
            strings.raw = raw || (Array.isArray(strings) ? strings.slice(0) : Array.prototype.slice.call(strings, 0));
            return strings;
        }

    /***/ }),

    /***/ "(rsc)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _interop_require_default });

        /**
         * Normalizes CommonJS and ES module interop for default imports in RSC context.
         * Optimized with direct type evaluations to minimize instruction count and branching overhead.
         * @template T
         * @param {T} obj - The imported module object.
         * @returns {T | { default: T }} The normalized module wrapper.
         */
        function _interop_require_default(obj) {
            if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
                return { default: obj };
            }
            return obj.__esModule ? obj : { default: obj };
        }

    /***/ })

};