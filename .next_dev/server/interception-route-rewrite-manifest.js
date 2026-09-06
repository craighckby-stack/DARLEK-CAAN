(function initializeInterceptionRouteRewriteManifest() {
  "use strict";

  const GLOBAL_SCOPE = globalThis;
  const MANIFEST_PROPERTY_KEY = "__INTERCEPTION_ROUTE_REWRITE_MANIFEST";
  const DEFAULT_SERIALIZED_MANIFEST = "[]";

  /**
   * Determines whether the manifest has already been registered on the target global scope.
   *
   * @param {typeof globalThis} targetScope - The target global execution context.
   * @param {string} propertyKey - The property name representing the manifest.
   * @returns {boolean} True if the manifest property exists on the target scope.
   */
  function hasManifest(targetScope, propertyKey) {
    return Object.hasOwn
      ? Object.hasOwn(targetScope, propertyKey)
      : Object.prototype.hasOwnProperty.call(targetScope, propertyKey);
  }

  /**
   * Registers an immutable manifest on the target global scope with a fallback assignment.
   *
   * @param {typeof globalThis} targetScope - The target global execution context.
   * @param {string} propertyKey - The property name to register.
   * @param {string} serializedPayload - The initial JSON-serialized manifest payload.
   */
  function registerGlobalManifest(targetScope, propertyKey, serializedPayload) {
    if (hasManifest(targetScope, propertyKey)) {
      return;
    }

    try {
      Object.defineProperty(targetScope, propertyKey, {
        value: serializedPayload,
        writable: false,
        configurable: false,
        enumerable: true
      });
    } catch (_definitionError) {
      targetScope[propertyKey] = serializedPayload;
    }
  }

  registerGlobalManifest(
    GLOBAL_SCOPE,
    MANIFEST_PROPERTY_KEY,
    DEFAULT_SERIALIZED_MANIFEST
  );
})();