"use strict";

exports.id = "vendor-chunks/class-variance-authority";
exports.ids = ["vendor-chunks/class-variance-authority"];
exports.modules = {

/***/ "(ssr)/./node_modules/class-variance-authority/dist/index.mjs":
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
__webpack_require__.d(__webpack_exports__, {
  cva: () => (cva),
  cx: () => (cx)
});
var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("(ssr)/./node_modules/clsx/dist/clsx.mjs");

/**
 * Defensive security key set to prevent prototype pollution attacks.
 */
const DANGEROUS_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isObject = (val) => val !== null && typeof val === "object";

const safeHasOwn = (obj, key) =>
  isObject(obj) && !DANGEROUS_KEYS.has(key) && Object.prototype.hasOwnProperty.call(obj, key);

const falsyToString = (value) => {
  if (typeof value === "boolean") return `${value}`;
  if (value === 0) return "0";
  if (typeof value === "symbol") return "";
  return value;
};

const cx = clsx__WEBPACK_IMPORTED_MODULE_0__.clsx;

const cva = (base, config) => (props) => {
  const safeConfig = isObject(config) ? config : {};
  const safeProps = isObject(props) ? props : {};

  if (!safeConfig.variants || !isObject(safeConfig.variants)) {
    return cx(base, safeProps.class, safeProps.className);
  }

  const { variants, defaultVariants } = safeConfig;
  const safeDefaultVariants = isObject(defaultVariants) ? defaultVariants : {};

  const getVariantClassNames = Object.keys(variants).map((variant) => {
    if (DANGEROUS_KEYS.has(variant) || !safeHasOwn(variants, variant)) return null;

    const variantProp = safeHasOwn(safeProps, variant) ? safeProps[variant] : undefined;
    const defaultVariantProp = safeHasOwn(safeDefaultVariants, variant) ? safeDefaultVariants[variant] : undefined;

    if (variantProp === null) return null;

    const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
    if (variantKey === undefined || variantKey === null) return null;

    const variantObj = variants[variant];
    return isObject(variantObj) && safeHasOwn(variantObj, variantKey) ? variantObj[variantKey] : undefined;
  });

  const propsWithoutUndefined = {};
  for (const key of Object.keys(safeProps)) {
    if (DANGEROUS_KEYS.has(key)) continue;
    const val = safeProps[key];
    if (val !== undefined) {
      propsWithoutUndefined[key] = val;
    }
  }

  const mergedProps = { ...safeDefaultVariants, ...propsWithoutUndefined };

  const getCompoundVariantClassNames = Array.isArray(safeConfig.compoundVariants)
    ? safeConfig.compoundVariants.reduce((acc, param) => {
        if (!isObject(param)) return acc;
        const { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;

        const isMatch = Object.keys(compoundVariantOptions).every((key) => {
          if (DANGEROUS_KEYS.has(key)) return false;
          const targetValue = compoundVariantOptions[key];
          const actualValue = mergedProps[key];

          return Array.isArray(targetValue)
            ? targetValue.includes(actualValue)
            : actualValue === targetValue;
        });

        if (isMatch) {
          if (cvClass) acc.push(cvClass);
          if (cvClassName) acc.push(cvClassName);
        }
        return acc;
      }, [])
    : [];

  return cx(base, getVariantClassNames, getCompoundVariantClassNames, safeProps.class, safeProps.className);
};

/***/ })

};