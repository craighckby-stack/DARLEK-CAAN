"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: ".next_dev/server/vendor-chunks/@swc.js"
 * Optimization Goal: READABILITY - Pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */

exports.id = "vendor-chunks/@swc";
exports.ids = ["vendor-chunks/@swc"];
exports.modules = {

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireDefault });

        /**
         * Normalizes CommonJS and ES module interoperability for default imports.
         *
         * @template T
         * @param {T} moduleImport - The imported module target or primitive value.
         * @returns {T | { default: T }} The normalized module object exposing a `default` property.
         */
        function interopRequireDefault(moduleImport) {
            const isNonObjectOrNull = moduleImport === null || (typeof moduleImport !== "object" && typeof moduleImport !== "function");

            if (isNonObjectOrNull) {
                return { default: moduleImport };
            }

            return moduleImport.__esModule ? moduleImport : { default: moduleImport };
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireWildcard });

        // Module identity caches mapped per interop mode to avoid redundant namespace object creation
        const babelInteropCache = typeof WeakMap === "function" ? new WeakMap() : null;
        const nodeInteropCache = typeof WeakMap === "function" ? new WeakMap() : null;

        /**
         * Resolves the appropriate WeakMap cache instance based on the nodeInterop flag.
         *
         * @param {boolean} isNodeInterop - Indicates if Node.js-style resolution is requested.
         * @returns {WeakMap<object, object> | null} The corresponding cache or null if WeakMap is unsupported.
         */
        function getWildcardCache(isNodeInterop) {
            return isNodeInterop ? nodeInteropCache : babelInteropCache;
        }

        /**
         * Copies property descriptors or values from a source module to the target namespace object.
         *
         * @param {object} targetNamespace - The newly created null-prototype namespace.
         * @param {object} sourceModule - The source module being converted.
         */
        function copyModuleProperties(targetNamespace, sourceModule) {
            const propertyKeys = Object.keys(sourceModule);
            const supportsPropertyDescriptors = typeof Object.defineProperty === "function" && typeof Object.getOwnPropertyDescriptor === "function";

            for (const propertyKey of propertyKeys) {
                if (propertyKey === "default" || !Object.prototype.hasOwnProperty.call(sourceModule, propertyKey)) {
                    continue;
                }

                const descriptor = supportsPropertyDescriptors
                    ? Object.getOwnPropertyDescriptor(sourceModule, propertyKey)
                    : null;

                const hasAccessor = descriptor && (descriptor.get || descriptor.set);

                if (hasAccessor) {
                    Object.defineProperty(targetNamespace, propertyKey, descriptor);
                } else {
                    targetNamespace[propertyKey] = sourceModule[propertyKey];
                }
            }
        }

        /**
         * Wraps an imported module in an ES Module namespace shape with wildcard property forwarding.
         *
         * @param {object} sourceModule - The source module or export to wrap.
         * @param {boolean} nodeInterop - Flag specifying whether Node interop semantics apply.
         * @returns {object} The standardized wildcard module namespace.
         */
        function interopRequireWildcard(sourceModule, nodeInterop) {
            if (!nodeInterop && sourceModule && sourceModule.__esModule) {
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
                cache.set(sourceModule, moduleNamespace);
            }

            return moduleNamespace;
        }

    /***/ }),

    /***/ "(ssr)/./node_modules/@swc/helpers/esm/_tagged_template_literal_loose.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => taggedTemplateLiteralLoose });

        /**
         * Attaches a raw string array clone to tagged template strings in loose compilation mode.
         *
         * @param {string[]} strings - Array of processed template string literals.
         * @param {string[]} [rawStrings] - Optional raw source strings array.
         * @returns {string[]} The decorated strings array with an attached `raw` property.
         * @throws {TypeError} If the `strings` parameter is not an object.
         */
        function taggedTemplateLiteralLoose(strings, rawStrings) {
            if (!strings || typeof strings !== "object") {
                throw new TypeError("Invalid template literal strings argument: expected an object or array.");
            }

            const fallbackRawStrings = Array.isArray(strings)
                ? strings.slice(0)
                : Array.prototype.slice.call(strings, 0);

            strings.raw = rawStrings || fallbackRawStrings;
            return strings;
        }

    /***/ }),

    /***/ "(rsc)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
    /***/ ((__unused_webpack_module__, __webpack_exports__, __webpack_require__) => {

        __webpack_require__.r(__webpack_exports__);
        __webpack_require__.d(__webpack_exports__, { _: () => interopRequireDefault });

        /**
         * Normalizes CommonJS and ES module interoperability for default imports in React Server Components (RSC) context.
         *
         * @template T
         * @param {T} moduleImport - The imported module target or primitive value.
         * @returns {T | { default: T }} The normalized module object exposing a `default` property.
         */
        function interopRequireDefault(moduleImport) {
            const isNonObjectOrNull = moduleImport === null || (typeof moduleImport !== "object" && typeof moduleImport !== "function");

            if (isNonObjectOrNull) {
                return { default: moduleImport };
            }

            return moduleImport.__esModule ? moduleImport : { default: moduleImport };
        }

    /***/ })

};