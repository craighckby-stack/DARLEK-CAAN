(function () {
  "use strict";

  const TARGET_SCOPE = typeof globalThis !== "undefined" ? globalThis : (typeof self !== "undefined" ? self : this);
  const MANIFEST_KEY = "__INTERCEPTION_ROUTE_REWRITE_MANIFEST";
  const MANIFEST_PAYLOAD = "[]";

  // Defensive validation: Enforce type safety and upper bound payload constraints
  if (typeof MANIFEST_PAYLOAD !== "string" || MANIFEST_PAYLOAD.length > 1048576) {
    throw new TypeError("Security Violation: Interception route rewrite manifest failed integrity validation.");
  }

  // Prevent prototype pollution and unauthorized runtime mutation via immutable property definition
  try {
    Object.defineProperty(TARGET_SCOPE, MANIFEST_KEY, {
      value: MANIFEST_PAYLOAD,
      writable: false,
      configurable: false,
      enumerable: true
    });
  } catch (_) {
    TARGET_SCOPE[MANIFEST_KEY] = MANIFEST_PAYLOAD;
  }
})();