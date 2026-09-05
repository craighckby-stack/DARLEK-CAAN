"use strict";

exports.id = "vendor-chunks/clsx";
exports.ids = ["vendor-chunks/clsx"];
exports.modules = {
  /***/ "(ssr)/./node_modules/clsx/dist/clsx.mjs":
  /*!*****************************************!*\
    !*** ./node_modules/clsx/dist/clsx.mjs ***!
    \*****************************************/
  /***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {
    __webpack_require__.r(__webpack_exports__);
    __webpack_require__.d(__webpack_exports__, {
      clsx: () => clsx,
      default: () => __WEBPACK_DEFAULT_EXPORT__
    });

    const MAX_RECURSION_DEPTH = 32;
    const hasOwn = Object.prototype.hasOwnProperty;
    const FORBIDDEN_OBJECT_KEYS = new Set(["__proto__", "prototype", "constructor"]);

    /**
     * Appends a class string to an accumulator with a space separator if needed.
     *
     * @param {string} accumulator - The current accumulated class string
     * @param {string} nextValue - The class string to append
     * @returns {string} The updated accumulator string
     */
    function appendClass(accumulator, nextValue) {
      if (!nextValue) return accumulator;
      return accumulator ? `${accumulator} ${nextValue}` : nextValue;
    }

    /**
     * Parses array-type class values recursively.
     *
     * @param {Array<unknown>} array - The array of class tokens
     * @param {number} depth - Current recursion depth
     * @param {Set<object>} visited - Tracked reference set for cycle detection
     * @returns {string} Sanitized and joined class string
     */
    function parseArrayValue(array, depth, visited) {
      let result = "";
      const len = array.length;
      
      for (let i = 0; i < len; i++) {
        const item = array[i];
        if (item) {
          const parsed = parseClassValue(item, depth + 1, visited);
          result = appendClass(result, parsed);
        }
      }
      
      return result;
    }

    /**
     * Parses object-type class values with safety guards against prototype pollution.
     *
     * @param {Record<string, unknown>} obj - The dictionary of class toggles
     * @returns {string} Sanitized and joined class string
     */
    function parseObjectValue(obj) {
      let result = "";
      const keys = Object.keys(obj);
      const len = keys.length;

      for (let i = 0; i < len; i++) {
        const key = keys[i];
        if (
          !FORBIDDEN_OBJECT_KEYS.has(key) &&
          hasOwn.call(obj, key) &&
          Boolean(obj[key])
        ) {
          result = appendClass(result, key);
        }
      }

      return result;
    }

    /**
     * Defensively processes nested class values with depth boundaries, cyclic reference guards,
     * and prototype pollution mitigation.
     *
     * @param {unknown} value - Candidate class token, array, or object
     * @param {number} [depth=0] - Current recursion depth
     * @param {Set<object>} [visited] - Tracked reference set for cycle detection
     * @returns {string} Sanitized and joined class string
     */
    function parseClassValue(value, depth = 0, visited = undefined) {
      if (depth > MAX_RECURSION_DEPTH || value === null || value === undefined) {
        return "";
      }

      const valType = typeof value;

      if (valType === "string") {
        return value;
      }

      if (valType === "number") {
        return Number.isFinite(value) ? String(value) : "";
      }

      if (valType === "bigint") {
        return value.toString();
      }

      if (valType !== "object") {
        return "";
      }

      const activeVisited = visited ?? new Set();
      if (activeVisited.has(value)) {
        return "";
      }

      activeVisited.add(value);

      try {
        if (Array.isArray(value)) {
          return parseArrayValue(value, depth, activeVisited);
        }
        return parseObjectValue(/** @type {Record<string, unknown>} */ (value));
      } finally {
        activeVisited.delete(value);
      }
    }

    /**
     * Constructs concatenated class names with defensive input validation.
     *
     * @params {...unknown} args - Candidate class tokens, arrays, or objects
     * @returns {string} Joined class name string
     */
    function clsx(...args) {
      let result = "";
      const len = args.length;

      for (let i = 0; i < len; i++) {
        const arg = args[i];
        if (arg) {
          const parsed = parseClassValue(arg, 0);
          result = appendClass(result, parsed);
        }
      }

      return result;
    }

    const __WEBPACK_DEFAULT_EXPORT__ = clsx;
  })
};