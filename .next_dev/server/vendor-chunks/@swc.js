"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: ".next_dev/server/vendor-chunks/@swc.js"
 * Target: Readability, Modern Idioms, and Architectural Clarity
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
         * @template T
         * @param {T} obj - The imported module object.
         * @returns {T | { default: T }} The normalized module wrapper.
         */
        function _interop_require_default(obj) {
            const isNullOrPrimitive = obj === null || (typeof obj !== "object" && typeof obj !== "function");
            
            if (isNullOrPrimitive) {
                return { default: obj };
            }

            return obj && obj.__esModule ? obj : { default: obj };
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _interop_require_wildcard });

        /**
         * Retrieves the appropriate WeakMap cache for wildcard module interop.
         * @param {boolean} nodeInterop - Flag indicating node interop mode.
         * @returns {WeakMap<object, object> | null} The caching map instance.
         */
        function _getRequireWildcardCache(nodeInterop) {
            if (typeof WeakMap !== "function") return null;
            
            const cacheBabelInterop = new WeakMap();
            const cacheNodeInterop = new WeakMap();
            
            return (_getRequireWildcardCache = (targetNodeInterop) => 
                targetNodeInterop ? cacheNodeInterop : cacheBabelInterop
            )(nodeInterop);
        }

        /**
         * Creates a namespace object wrapping wildcard module imports with proper descriptor copying.
         * @param {object} obj - The source module object.
         * @param {boolean} nodeInterop - Flag indicating node interop mode.
         * @returns {object} The compiled namespace object.
         */
        function _interop_require_wildcard(obj, nodeInterop) {
            if (!nodeInterop && obj && obj.__esModule) return obj;
            
            const isNullOrPrimitive = obj === null || (typeof obj !== "object" && typeof obj !== "function");
            if (isNullOrPrimitive) {
                return { default: obj };
            }

            const cache = _getRequireWildcardCache(nodeInterop);
            if (cache && cache.has(obj)) return cache.get(obj);

            const newObj = Object.create(null);
            const hasPropertyDescriptor = typeof Object.defineProperty === "function" && typeof Object.getOwnPropertyDescriptor === "function";

            for (const key of Object.keys(obj)) {
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
         * @param {string[]} strings - The template literal string array.
         * @param {string[]} [raw] - The raw strings array.
         * @returns {string[]} The decorated strings array.
         */
        function _tagged_template_literal_loose(strings, raw) {
            if (!strings || typeof strings !== "object") {
                throw new TypeError("Invalid template literal strings argument");
            }
            
            const resolvedRaw = raw || (Array.isArray(strings) ? strings.slice(0) : Array.prototype.slice.call(strings, 0));
            strings.raw = resolvedRaw;
            
            return strings;
        }

    /***/ }),

    /***/ "(rsc)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    
        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => _interop_require_default });

        /**
         * Normalizes CommonJS and ES module interop for default imports in RSC context.
         * @template T
         * @param {T} obj - The imported module object.
         * @returns {T | { default: T }} The normalized module wrapper.
         */
        function _interop_require_default(obj) {
            const isNullOrPrimitive = obj === null || (typeof obj !== "object" && typeof obj !== "function");
            
            if (isNullOrPrimitive) {
                return { default: obj };
            }

            return obj && obj.__esModule ? obj : { default: obj };
        }

    /***/ })

};