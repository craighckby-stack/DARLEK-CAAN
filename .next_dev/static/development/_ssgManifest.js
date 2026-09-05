'use strict';
(function () {
  const globalScope =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
        ? self
        : typeof window !== 'undefined'
          ? window
          : typeof global !== 'undefined'
            ? global
            : this;

  if (!globalScope || (typeof globalScope !== 'object' && typeof globalScope !== 'function')) {
    return;
  }

  try {
    const SafeSet = typeof Set === 'function' ? Set : Array;
    Object.defineProperty(globalScope, '__SSG_MANIFEST', {
      value: new SafeSet(),
      writable: true,
      enumerable: true,
      configurable: true
    });

    const callback = globalScope.__SSG_MANIFEST_CB;
    if (typeof callback === 'function') {
      Reflect.apply(callback, globalScope, []);
    }
  } catch {
    // Gracefully contain volatile execution and prevent unhandled runtime errors
  }
})();