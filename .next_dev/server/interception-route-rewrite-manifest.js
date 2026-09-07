(function initializeInterceptionRouteRewriteManifest() {
  "use strict";

  /** @type {typeof globalThis} */
  const GLOBAL_SCOPE = globalThis;
  /** @type {string} */
  const MANIFEST_PROPERTY_KEY = "__INTERCEPTION_ROUTE_REWRITE_MANIFEST";
  /** @type {string} */
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
   * @returns {void}
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
      /**
       * Fallback assignment for locked or non-extensible global scopes.
       */
      try {
        targetScope[propertyKey] = serializedPayload;
      } catch (_assignmentError) {
        // Suppress failure if global scope is entirely frozen or protected
      }
    }
  }

  registerGlobalManifest(
    GLOBAL_SCOPE,
    MANIFEST_PROPERTY_KEY,
    DEFAULT_SERIALIZED_MANIFEST
  );
})();