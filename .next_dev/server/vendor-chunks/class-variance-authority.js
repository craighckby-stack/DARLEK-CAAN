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

const clsxModule = __webpack_require__("(ssr)/./node_modules/clsx/dist/clsx.mjs");

/**
 * Defensive security key set to prevent prototype pollution vectors.
 */
const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "constructor", "prototype"]);

/**
 * Type guard to check if a given value is a non-null object.
 */
const isObject = (value) => value !== null && typeof value === "object";

/**
 * Safely checks object own-property existence avoiding prototype vulnerabilities.
 */
const hasOwnProp = (targetObject, key) =>
  isObject(targetObject) && 
  !PROTOTYPE_POLLUTION_KEYS.has(key) && 
  Object.prototype.hasOwnProperty.call(targetObject, key);

/**
 * Normalizes primitive types into string representations for styling evaluation.
 */
const coerceToString = (value) => {
  if (typeof value === "boolean") return String(value);
  if (value === 0) return "0";
  if (typeof value === "symbol") return "";
  return value;
};

const cx = clsxModule.clsx;

/**
 * Generates conditional class names based on base styles, variants, and compound configurations.
 */
const cva = (baseStyle, config) => (props) => {
  const resolvedConfig = isObject(config) ? config : {};
  const resolvedProps = isObject(props) ? props : {};

  const { variants, defaultVariants, compoundVariants } = resolvedConfig;

  if (!variants || !isObject(variants)) {
    return cx(baseStyle, resolvedProps.class, resolvedProps.className);
  }

  const safeDefaultVariants = isObject(defaultVariants) ? defaultVariants : {};

  // Extract individual variant class names
  const variantClassNames = Object.keys(variants).map((variantKey) => {
    if (PROTOTYPE_POLLUTION_KEYS.has(variantKey) || !hasOwnProp(variants, variantKey)) {
      return null;
    }

    const propValue = hasOwnProp(resolvedProps, variantKey) ? resolvedProps[variantKey] : undefined;
    const defaultPropValue = hasOwnProp(safeDefaultVariants, variantKey) ? safeDefaultVariants[variantKey] : undefined;

    if (propValue === null) return null;

    const matchedVariantKey = coerceToString(propValue) || coerceToString(defaultPropValue);
    if (matchedVariantKey === undefined || matchedVariantKey === null) {
      return null;
    }

    const variantGroup = variants[variantKey];
    return isObject(variantGroup) && hasOwnProp(variantGroup, matchedVariantKey)
      ? variantGroup[matchedVariantKey]
      : undefined;
  });

  // Sanitize provided properties to filter out undefined and dangerous keys
  const sanitizedProps = {};
  for (const key of Object.keys(resolvedProps)) {
    if (PROTOTYPE_POLLUTION_KEYS.has(key)) continue;
    const value = resolvedProps[key];
    if (value !== undefined) {
      sanitizedProps[key] = value;
    }
  }

  const mergedProps = { ...safeDefaultVariants, ...sanitizedProps };

  // Evaluate compound variant matches
  const compoundClassNames = Array.isArray(compoundVariants)
    ? compoundVariants.reduce((accumulatedClasses, compoundRule) => {
        if (!isObject(compoundRule)) return accumulatedClasses;

        const { class: ruleClass, className: ruleClassName, ...conditionOptions } = compoundRule;

        const isConditionMet = Object.keys(conditionOptions).every((conditionKey) => {
          if (PROTOTYPE_POLLUTION_KEYS.has(conditionKey)) return false;
          
          const expectedValue = conditionOptions[conditionKey];
          const actualValue = mergedProps[conditionKey];

          return Array.isArray(expectedValue)
            ? expectedValue.includes(actualValue)
            : actualValue === expectedValue;
        });

        if (isConditionMet) {
          if (ruleClass) accumulatedClasses.push(ruleClass);
          if (ruleClassName) accumulatedClasses.push(ruleClassName);
        }

        return accumulatedClasses;
      }, [])
    : [];

  return cx(
    baseStyle,
    variantClassNames,
    compoundClassNames,
    resolvedProps.class,
    resolvedProps.className
  );
};

/***/ })

};