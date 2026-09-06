"use strict";

exports.id = "vendor-chunks/lucide-react";
exports.ids = ["vendor-chunks/lucide-react"];
exports.modules = {

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/Icon.js":
/*!****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.js ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "(ssr)/./node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js");
/* harmony import */ var _defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.js */ "(ssr)/./node_modules/lucide-react/dist/esm/defaultAttributes.js");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "(ssr)/./node_modules/lucide-react/dist/esm/shared/src/utils.js");

const Icon = (0, react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
}, ref) => {
    const computedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : strokeWidth;

    const resolvedClassName = (0, _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)("lucide", className);

    const iconElements = iconNode.map(([tag, attrs], index) => 
        (0, react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, { key: attrs.key || index, ...attrs })
    );

    const resolvedChildren = Array.isArray(children) ? children : [children];

    return (0, react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
        "svg",
        {
            ref,
            ..._defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__["default"],
            width: size,
            height: size,
            stroke: color,
            strokeWidth: computedStrokeWidth,
            className: resolvedClassName,
            ...rest
        },
        [...iconElements, ...resolvedChildren]
    );
});

/* sourceMappingURL=Icon.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/createLucideIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "(ssr)/./node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "(ssr)/./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/* harmony import */ var _Icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Icon.js */ "(ssr)/./node_modules/lucide-react/dist/esm/Icon.js");

const createLucideIcon = (iconName, iconNode) => {
    const kebabName = (0, _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.toKebabCase)(iconName);
    
    const LucideIconComponent = (0, react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(({ className, ...props }, ref) => 
        (0, react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
            ref,
            iconNode,
            className: (0, _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)(\`lucide-\${kebabName}\`, className),
            ...props
        })
    );

    LucideIconComponent.displayName = iconName;
    return LucideIconComponent;
};

/* sourceMappingURL=createLucideIcon.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/defaultAttributes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });

const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};

/* sourceMappingURL=defaultAttributes.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/icons/house.js":
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/house.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ House)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "(ssr)/./node_modules/lucide-react/dist/esm/createLucideIcon.js");

const __iconNode = [
    [
        "path",
        {
            d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",
            key: "5wwlr5"
        }
    ],
    [
        "path",
        {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
            key: "1d0kgt"
        }
    ]
];

const House = (0, _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("House", __iconNode);

/* sourceMappingURL=house.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/icons/refresh-cw.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/refresh-cw.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   "default": () => (/* binding */ RefreshCw)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "(ssr)/./node_modules/lucide-react/dist/esm/createLucideIcon.js");

const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",
            key: "v9h5vc"
        }
    ],
    [
        "path",
        {
            d: "M21 3v5h-5",
            key: "1q7to0"
        }
    ],
    [
        "path",
        {
            d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",
            key: "3uifl3"
        }
    ],
    [
        "path",
        {
            d: "M8 16H3v5",
            key: "1cv678"
        }
    ]
];

const RefreshCw = (0, _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("RefreshCw", __iconNode);

/* sourceMappingURL=refresh-cw.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/icons/triangle-alert.js":
/*!********************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/triangle-alert.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   \"default\": () => (/* binding */ TriangleAlert)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "(ssr)/./node_modules/lucide-react/dist/esm/createLucideIcon.js");

const __iconNode = [
    [
        "path",
        {
            d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
            key: "wmoenq"
        }
    ],
    [
        "path",
        {
            d: "M12 9v4",
            key: "juzpu7"
        }
    ],
    [
        "path",
        {
            d: "M12 17h.01",
            key: "p32p05"
        }
    ]
];

const TriangleAlert = (0, _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("TriangleAlert", __iconNode);

/* sourceMappingURL=triangle-alert.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/icons/x.js":
/*!*******************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/x.js ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __iconNode: () => (/* binding */ __iconNode),
/* harmony export */   \"default\": () => (/* binding */ X)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "(ssr)/./node_modules/lucide-react/dist/esm/createLucideIcon.js");

const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];

const X = (0, _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("X", __iconNode);

/* sourceMappingURL=x.js.map */
`);

/***/ }),

/***/ "(ssr)/./node_modules/lucide-react/dist/esm/shared/src/utils.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval(`
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const mergeClasses = (...classes) => classes
    .filter((className, index, array) => Boolean(className) && className.trim() !== "" && array.indexOf(className) === index)
    .join(" ")
    .trim();

/* sourceMappingURL=utils.js.map */
`);

/***/ })

};