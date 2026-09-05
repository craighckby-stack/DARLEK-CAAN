(function initializeInterceptionRouteRewriteManifest() {
  "use strict";

  const GLOBAL_SCOPE = globalThis ?? self ?? this;
  const MANIFEST_PROPERTY_KEY = "__INTERCEPTION_ROUTE_REWRITE_MANIFEST";
  const MANIFEST_INITIAL_PAYLOAD = "[]";
  const MAXIMUM_PAYLOAD_LENGTH = 1048576;

  function validateManifestPayload(payload) {
    if (typeof payload !== "string" || payload.length > MAXIMUM_PAYLOAD_LENGTH) {
      throw new TypeError("Security Violation: Interception route rewrite manifest failed integrity validation.");
    }
  }

  function registerManifestGlobally(scope, key, payload) {
    try {
      Object.defineProperty(scope, key, {
        value: payload,
        writable: false,
        configurable: false,
        enumerable: true
      });
    } catch {
      scope[key] = payload;
    }
  }

  validateManifestPayload(MANIFEST_INITIAL_PAYLOAD);
  registerManifestGlobally(GLOBAL_SCOPE, MANIFEST_PROPERTY_KEY, MANIFEST_INITIAL_PAYLOAD);
})();