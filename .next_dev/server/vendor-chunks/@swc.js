"use strict";

exports.id = "vendor-chunks/@swc";
exports.ids = ["vendor-chunks/@swc"];
exports.modules = {

/***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, { _: () => _interop_require_default });

function _interop_require_default(obj) {
    if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
        return { default: obj };
    }
    return obj && obj.__esModule ? obj : { default: obj };
}

/***/ }),

/***/ "(ssr)/./node_modules/@swc/helpers/esm/_interop_require_wildcard.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, { _: () => _interop_require_wildcard });

function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}

function _interop_require_wildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) return obj;
    if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
        return { default: obj };
    }

    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) return cache.get(obj);

    var newObj = Object.create(null);
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;

    for (var key in obj) {
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
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

function _tagged_template_literal_loose(strings, raw) {
    if (!strings || typeof strings !== "object") {
        throw new TypeError("Invalid template literal strings argument");
    }
    if (!raw) {
        raw = Array.isArray(strings) ? strings.slice(0) : Array.prototype.slice.call(strings, 0);
    }
    strings.raw = raw;
    return strings;
}

/***/ }),

/***/ "(rsc)/./node_modules/@swc/helpers/esm/_interop_require_default.js":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, { _: () => _interop_require_default });

function _interop_require_default(obj) {
    if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
        return { default: obj };
    }
    return obj && obj.__esModule ? obj : { default: obj };
}

/***/ })

};