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
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const FORBIDDEN_OBJECT_KEYS = {
      __proto__: true,
      prototype: true,
      constructor: true
    };

    /**
     * Appends a class string to an accumulator with a space separator if needed.
     * 
     * @param {string} accumulator - The current accumulated class string
     * @param {string} nextValue - The class string to append
     * @returns {string} The updated accumulator string
     */
    function appendClass(accumulator, nextValue) {
      if (!nextValue) return accumulator;
      return accumulator ? accumulator + " " + nextValue : nextValue;
    }

    /**
     * Recursively parses array-type class values with unrolled iteration.
     * 
     * @param {Array<unknown>} array - The array of class tokens
     * @param {number} depth - Current recursion depth
     * @param {Set<object>} visited - Tracked reference set for cycle detection
     * @returns {string} Sanitized and joined class string
     */
    function parseArrayValue(array, depth, visited) {
      let result = "";
      const len = array.length;
      let i = 0;

      while (i < len - 3) {
        const item0 = array[i];
        const item1 = array[i + 1];
        const item2 = array[i + 2];
        const item3 = array[i + 3];

        if (item0) result = appendClass(result, parseClassValue(item0, depth + 1, visited));
        if (item1) result = appendClass(result, parseClassValue(item1, depth + 1, visited));
        if (item2) result = appendClass(result, parseClassValue(item2, depth + 1, visited));
        if (item3) result = appendClass(result, parseClassValue(item3, depth + 1, visited));

        i += 4;
      }

      while (i < len) {
        const item = array[i];
        if (item) {
          result = appendClass(result, parseClassValue(item, depth + 1, visited));
        }
        i++;
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
          !FORBIDDEN_OBJECT_KEYS[key] &&
          hasOwnProperty.call(obj, key) &&
          obj[key]
        ) {
          result = appendClass(result, key);
        }
      }

      return result;
    }

    /**
     * Processes nested class values with depth boundaries, cyclic guards, and type checks.
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

      const valueType = typeof value;

      if (valueType === "string") {
        return value;
      }

      if (valueType === "number") {
        return Number.isFinite(value) ? String(value) : "";
      }

      if (valueType === "bigint") {
        return value.toString();
      }

      if (valueType !== "object") {
        return "";
      }

      const activeVisited = visited || new Set();
      const targetObj = value;

      if (activeVisited.has(targetObj)) {
        return "";
      }

      activeVisited.add(targetObj);

      try {
        if (Array.isArray(value)) {
          return parseArrayValue(value, depth, activeVisited);
        }
        return parseObjectValue(value);
      } finally {
        activeVisited.delete(targetObj);
      }
    }

    /**
     * Constructs concatenated class names from variable arguments.
     * 
     * @params {...unknown} args - Candidate class tokens, arrays, or objects
     * @returns {string} Joined class name string
     */
    function clsx(...args) {
      let result = "";
      const len = args.length;
      let i = 0;

      while (i < len - 3) {
        const arg0 = args[i];
        const arg1 = args[i + 1];
        const arg2 = args[i + 2];
        const arg3 = args[i + 3];

        if (arg0) result = appendClass(result, parseClassValue(arg0, 0));
        if (arg1) result = appendClass(result, parseClassValue(arg1, 0));
        if (arg2) result = appendClass(result, parseClassValue(arg2, 0));
        if (arg3) result = appendClass(result, parseClassValue(arg3, 0));

        i += 4;
      }

      while (i < len) {
        const arg = args[i];
        if (arg) {
          result = appendClass(result, parseClassValue(arg, 0));
        }
        i++;
      }

      return result;
    }

    const __WEBPACK_DEFAULT_EXPORT__ = clsx;
  })
};