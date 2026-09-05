(function initializeInterceptionRouteRewriteManifest() {
  "use strict";

  const GLOBAL_SCOPE = globalThis;
  const MANIFEST_PROPERTY_KEY = "__INTERCEPTION_ROUTE_REWRITE_MANIFEST";
  const MANIFEST_INITIAL_PAYLOAD = "[]";

  const isManifestMissing = !Object.prototype.hasOwnProperty.call(GLOBAL_SCOPE, MANIFEST_PROPERTY_KEY);

  if (isManifestMissing) {
    try {
      Object.defineProperty(GLOBAL_SCOPE, MANIFEST_PROPERTY_KEY, {
        value: MANIFEST_INITIAL_PAYLOAD,
        writable: false,
        configurable: false,
        enumerable: true
      });
    } catch (defError) {
      GLOBAL_SCOPE[MANIFEST_PROPERTY_KEY] = MANIFEST_INITIAL_PAYLOAD;
    }
  }
})();