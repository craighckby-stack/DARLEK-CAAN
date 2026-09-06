"use strict";

/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: ".next_dev/server/vendor-chunks/class-variance-authority.js"
 * Goal: READABILITY - Modern idioms, expressive naming, modularity, architectural clarity.
 */

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

const clsxModule = __webpack_require__("(ssr)/./node_modules/clsx/dist/clsx.mjs");

/** Keys blocked from processing to safeguard against prototype pollution vulnerabilities. */
const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/** Type guard to determine if a value is a non-null object. */
const isObject = (value) => value !== null && typeof value === "object";

/** Validates whether an object owns a property safely without triggering pollution. */
const hasOwnProp = (targetObject, key) =>
  targetObject !== null && 
  typeof targetObject === "object" && 
  !PROTOTYPE_POLLUTION_KEYS.has(key) && 
  Object.prototype.hasOwnProperty.call(targetObject, key);

/** Coerces variant properties safely into string identifiers. */
const coerceToString = (value) => {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === 0) return "0";
  if (typeof value === "symbol") return "";
  return value;
};

const cx = clsxModule.clsx;

/**
 * Creates a class variance authority function for building dynamic CSS variant architectures.
 */
const cva = (baseStyle, config) => {
  const resolvedConfig = isObject(config) ? config : {};
  const { variants, defaultVariants, compoundVariants } = resolvedConfig;
  const safeDefaultVariants = isObject(defaultVariants) ? defaultVariants : {};

  return (props) => {
    const resolvedProps = isObject(props) ? props : {};

    if (!variants || !isObject(variants)) {
      return cx(baseStyle, resolvedProps.class, resolvedProps.className);
    }

    const variantKeys = Object.keys(variants);
    const variantKeysCount = variantKeys.length;
    const variantClassNames = new Array(variantKeysCount);

    for (let index = 0; index < variantKeysCount; index++) {
      const variantKey = variantKeys[index];
      if (PROTOTYPE_POLLUTION_KEYS.has(variantKey) || !Object.prototype.hasOwnProperty.call(variants, variantKey)) {
        variantClassNames[index] = null;
        continue;
      }

      const propValue = Object.prototype.hasOwnProperty.call(resolvedProps, variantKey) ? resolvedProps[variantKey] : undefined;
      const defaultPropValue = Object.prototype.hasOwnProperty.call(safeDefaultVariants, variantKey) ? safeDefaultVariants[variantKey] : undefined;

      if (propValue === null) {
        variantClassNames[index] = null;
        continue;
      }

      const matchedVariantKey = coerceToString(propValue) ?? coerceToString(defaultPropValue);
      if (matchedVariantKey === undefined || matchedVariantKey === null) {
        variantClassNames[index] = null;
        continue;
      }

      const variantGroup = variants[variantKey];
      variantClassNames[index] = (isObject(variantGroup) && Object.prototype.hasOwnProperty.call(variantGroup, matchedVariantKey))
        ? variantGroup[matchedVariantKey]
        : undefined;
    }

    const mergedProps = { ...safeDefaultVariants };
    const propKeys = Object.keys(resolvedProps);
    const propKeysCount = propKeys.length;

    for (let index = 0; index < propKeysCount; index++) {
      const key = propKeys[index];
      if (!PROTOTYPE_POLLUTION_KEYS.has(key)) {
        const val = resolvedProps[key];
        if (val !== undefined) {
          mergedProps[key] = val;
        }
      }
    }

    let compoundClassNames = null;
    if (Array.isArray(compoundVariants)) {
      compoundClassNames = [];
      const compoundCount = compoundVariants.length;

      for (let index = 0; index < compoundCount; index++) {
        const compoundRule = compoundVariants[index];
        if (!isObject(compoundRule)) continue;

        const { class: ruleClass, className: ruleClassName, ...conditionOptions } = compoundRule;
        const conditionKeys = Object.keys(conditionOptions);
        const conditionCount = conditionKeys.length;
        let isConditionMet = true;

        for (let j = 0; j < conditionCount; j++) {
          const conditionKey = conditionKeys[j];
          if (PROTOTYPE_POLLUTION_KEYS.has(conditionKey)) {
            isConditionMet = false;
            break;
          }

          const expectedValue = conditionOptions[conditionKey];
          const actualValue = mergedProps[conditionKey];

          if (Array.isArray(expectedValue)) {
            if (!expectedValue.includes(actualValue)) {
              isConditionMet = false;
              break;
            }
          } else if (actualValue !== expectedValue) {
            isConditionMet = false;
            break;
          }
        }

        if (isConditionMet) {
          if (ruleClass) compoundClassNames.push(ruleClass);
          if (ruleClassName) compoundClassNames.push(ruleClassName);
        }
      }
    }

    return cx(
      baseStyle,
      variantClassNames,
      compoundClassNames,
      resolvedProps.class,
      resolvedProps.className
    );
  };
};

/***/ })

};