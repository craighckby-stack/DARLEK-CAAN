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

const PROTOTYPE_POLLUTION_KEYS = new Set(["__proto__", "constructor", "prototype"]);

const isObject = (value) => value !== null && typeof value === "object";

const hasOwnProp = (targetObject, key) =>
  targetObject !== null && 
  typeof targetObject === "object" && 
  !PROTOTYPE_POLLUTION_KEYS.has(key) && 
  Object.prototype.hasOwnProperty.call(targetObject, key);

const coerceToString = (value) => {
  if (typeof value === "boolean") return value ? "true" : "false";
  if (value === 0) return "0";
  if (typeof value === "symbol") return "";
  return value;
};

const cx = clsxModule.clsx;

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
    const variantKeysLen = variantKeys.length;
    const variantClassNames = new Array(variantKeysLen);

    for (let i = 0; i < variantKeysLen; i++) {
      const variantKey = variantKeys[i];
      if (PROTOTYPE_POLLUTION_KEYS.has(variantKey) || !Object.prototype.hasOwnProperty.call(variants, variantKey)) {
        variantClassNames[i] = null;
        continue;
      }

      const propValue = Object.prototype.hasOwnProperty.call(resolvedProps, variantKey) ? resolvedProps[variantKey] : undefined;
      const defaultPropValue = Object.prototype.hasOwnProperty.call(safeDefaultVariants, variantKey) ? safeDefaultVariants[variantKey] : undefined;

      if (propValue === null) {
        variantClassNames[i] = null;
        continue;
      }

      const matchedVariantKey = coerceToString(propValue) ?? coerceToString(defaultPropValue);
      if (matchedVariantKey === undefined || matchedVariantKey === null) {
        variantClassNames[i] = null;
        continue;
      }

      const variantGroup = variants[variantKey];
      variantClassNames[i] = (isObject(variantGroup) && Object.prototype.hasOwnProperty.call(variantGroup, matchedVariantKey))
        ? variantGroup[matchedVariantKey]
        : undefined;
    }

    const mergedProps = { ...safeDefaultVariants };
    const propKeys = Object.keys(resolvedProps);
    const propKeysLen = propKeys.length;

    for (let i = 0; i < propKeysLen; i++) {
      const key = propKeys[i];
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
      const cvLen = compoundVariants.length;

      for (let i = 0; i < cvLen; i++) {
        const compoundRule = compoundVariants[i];
        if (!isObject(compoundRule)) continue;

        const { class: ruleClass, className: ruleClassName, ...conditionOptions } = compoundRule;
        const conditionKeys = Object.keys(conditionOptions);
        const ckLen = conditionKeys.length;
        let isConditionMet = true;

        for (let j = 0; j < ckLen; j++) {
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