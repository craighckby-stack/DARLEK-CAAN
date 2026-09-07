"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: ".next_dev/server/vendor-chunks/@swc.js"
 * Optimization Goal: COMPREHENSIVE - Sovereign overhaul focusing on maximum performance, strict type-safety invariants, low-overhead memory caching, and defensive runtime error handling.
 */

exports.id = "vendor-chunks/@swc";
exports.ids = ["vendor-chunks/@swc"];
exports.modules = {

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireDefault });

        /**
         * Normalizes CommonJS and ES module interoperability for default imports with strict null-safety and guard validation.
         *
         * @template T
         * @param {T} moduleImport - The imported module target or primitive value.
         * @returns {T | { default: T }} The normalized module object exposing a `default` property.
         */
        function interopRequireDefault(moduleImport) {
            try {
                const isNonObjectOrNull = moduleImport === null || (typeof moduleImport !== "object" && typeof moduleImport !== "function");

                if (isNonObjectOrNull) {
                    return { default: moduleImport };
                }

                return Boolean(moduleImport.__esModule) ? moduleImport : { default: moduleImport };
            } catch (error) {
                // Defensive fallback to prevent runtime execution halts during interop resolution
                return { default: moduleImport };
            }
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireWildcard });

        // High-performance memoization WeakMaps mapped per interop mode to avoid redundant allocations
        const babelInteropCache = typeof WeakMap === "function" ? new WeakMap() : null;
        const nodeInteropCache = typeof WeakMap === "function" ? new WeakMap() : null;

        /**
         * Resolves the appropriate WeakMap cache instance based on the nodeInterop flag with memory safety.
         *
         * @param {boolean} isNodeInterop - Indicates if Node.js-style resolution is requested.
         * @returns {WeakMap<object, object> | null} The corresponding cache or null if WeakMap is unsupported.
         */
        function getWildcardCache(isNodeInterop) {
            return isNodeInterop ? nodeInteropCache : babelInteropCache;
        }

        /**
         * Copies property descriptors or enumerable values from a source module to the target namespace object securely.
         *
         * @param {object} targetNamespace - The newly created null-prototype namespace.
         * @param {object} sourceModule - The source module being converted.
         */
        function copyModuleProperties(targetNamespace, sourceModule) {
            if (!sourceModule || (typeof sourceModule !== "object" && typeof sourceModule !== "function")) {
                return;
            }

            const propertyKeys = Object.keys(sourceModule);
            const supportsPropertyDescriptors = typeof Object.defineProperty === "function" && typeof Object.getOwnPropertyDescriptor === "function";

            for (let i = 0; i < propertyKeys.length; i++) {
                const propertyKey = propertyKeys[i];

                if (propertyKey === "default" || !Object.prototype.hasOwnProperty.call(sourceModule, propertyKey)) {
                    continue;
                }

                try {
                    const descriptor = supportsPropertyDescriptors
                        ? Object.getOwnPropertyDescriptor(sourceModule, propertyKey)
                        : null;

                    const hasAccessor = descriptor && (descriptor.get !== undefined || descriptor.set !== undefined);

                    if (hasAccessor && descriptor) {
                        Object.defineProperty(targetNamespace, propertyKey, descriptor);
                    } else {
                        targetNamespace[propertyKey] = sourceModule[propertyKey];
                    }
                } catch (propertyError) {
                    // Fail gracefully per property to ensure robust namespace population
                    targetNamespace[propertyKey] = sourceModule[propertyKey];
                }
            }
        }

        /**
         * Wraps an imported module in an ES Module namespace shape with optimized wildcard property forwarding and caching.
         *
         * @param {object} sourceModule - The source module or export to wrap.
         * @param {boolean} nodeInterop - Flag specifying whether Node interop semantics apply.
         * @returns {object} The standardized wildcard module namespace.
         */
        function interopRequireWildcard(sourceModule, nodeInterop) {
            try {
                if (!nodeInterop && sourceModule && sourceModule.__esModule === true) {
                    return sourceModule;
                }

                const isPrimitiveOrNull = sourceModule === null || (typeof sourceModule !== "object" && typeof sourceModule !== "function");
                if (isPrimitiveOrNull) {
                    return { default: sourceModule };
                }

                const cache = getWildcardCache(nodeInterop);
                if (cache && cache.has(sourceModule)) {
                    return cache.get(sourceModule);
                }

                const moduleNamespace = Object.create(null);
                copyModuleProperties(moduleNamespace, sourceModule);
                moduleNamespace.default = sourceModule;

                if (cache) {
                    try {
                        cache.set(sourceModule, moduleNamespace);
                    } catch (cacheError) {
                        // Suppress cache storage errors if object is non-extensible
                    }
                }

                return moduleNamespace;
            } catch (error) {
                return { default: sourceModule };
            }
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => taggedTemplateLiteralLoose });

        /**
         * Attaches a raw string array clone to tagged template strings in loose compilation mode with type guards.
         *
         * @param {string[]} strings - Array of processed template string literals.
         * @param {string[]} [rawStrings] - Optional raw source strings array.
         * @returns {string[]} The decorated strings array with an attached `raw` property.
         * @throws {TypeError} If the `strings` parameter is not an object or array.
         */
        function taggedTemplateLiteralLoose(strings, rawStrings) {
            if (!strings || (typeof strings !== "object" && typeof strings !== "function")) {
                throw new TypeError("Invalid template literal strings argument: expected an object or array.");
            }

            try {
                const fallbackRawStrings = Array.isArray(strings)
                    ? strings.slice(0)
                    : Array.prototype.slice.call(strings, 0);

                strings.raw = rawStrings || fallbackRawStrings;
                return strings;
            } catch (error) {
                if (error instanceof TypeError) {
                    throw error;
                }
                throw new TypeError("Failed to assign raw template strings property: " + (error && error.message ? error.message : "Unknown error"));
            }
        }

    /***/ }),

    /***/ "(rsc)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireDefault });

        /**
         * Normalizes CommonJS and ES module interoperability for default imports in React Server Components (RSC) with fault tolerance.
         *
         * @template T
         * @param {T} moduleImport - The imported module target or primitive value.
         * @returns {T | { default: T }} The normalized module object exposing a `default` property.
         */
        function interopRequireDefault(moduleImport) {
            try {
                const isNonObjectOrNull = moduleImport === null || (typeof moduleImport !== "object" && typeof moduleImport !== "function");

                if (isNonObjectOrNull) {
                    return { default: moduleImport };
                }

                return Boolean(moduleImport.__esModule) ? moduleImport : { default: moduleImport };
            } catch (error) {
                return { default: moduleImport };
            }
        }

    /***/ })

};