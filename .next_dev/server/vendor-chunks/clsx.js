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

      if (!visited) {
        visited = new Set();
      } else if (visited.has(value)) {
        return "";
      }

      visited.add(value);
      let result = "";

      try {
        if (Array.isArray(value)) {
          const len = value.length;
          for (let i = 0; i < len; i++) {
            const item = value[i];
            if (item) {
              const str = parseClassValue(item, depth + 1, visited);
              if (str) {
                if (result) result += " ";
                result += str;
              }
            }
          }
        } else {
          const keys = Object.keys(value);
          const len = keys.length;
          for (let i = 0; i < len; i++) {
            const key = keys[i];
            if (
              key !== "__proto__" &&
              key !== "prototype" &&
              key !== "constructor" &&
              hasOwn.call(value, key) &&
              Boolean(value[key])
            ) {
              if (result) result += " ";
              result += key;
            }
          }
        }
      } finally {
        visited.delete(value);
      }

      return result;
    }

    /**
     * Constructs concatenated class names with defensive input validation.
     *
     * @returns {string} Joined class name string
     */
    function clsx() {
      let result = "";
      const len = arguments.length;

      for (let i = 0; i < len; i++) {
        const arg = arguments[i];
        if (arg) {
          const str = parseClassValue(arg, 0);
          if (str) {
            if (result) result += " ";
            result += str;
          }
        }
      }

      return result;
    }

    const __WEBPACK_DEFAULT_EXPORT__ = clsx;
  })
};