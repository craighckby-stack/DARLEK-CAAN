/**
 * EMG Core v49 Neural Code Optimizer Engine
 * Optimized Webpack Bootstrap & Runtime Environment
 */
(() => {
    "use strict";

    // Module registry container
    const modulesRegistry = {};

    // Null-prototype mapping cache for high-performance module resolution
    const moduleCache = Object.create(null);

    /**
     * Core module loader mimicking CommonJS/Webpack resolution strategy.
     * @param {string|number} moduleId - The target identifier of the module to load.
     * @returns {any} The exported API of the resolved module.
     */
    function webpackRequire(moduleId) {
        const cachedModule = moduleCache[moduleId];
        if (cachedModule !== undefined) {
            return cachedModule.exports;
        }

        const activeModule = moduleCache[moduleId] = {
            id: moduleId,
            loaded: false,
            exports: {}
        };

        let executionFailed = true;
        try {
            modulesRegistry[moduleId](activeModule, activeModule.exports, webpackRequire);
            executionFailed = false;
        } finally {
            if (executionFailed) {
                delete moduleCache[moduleId];
            }
        }

        activeModule.loaded = true;
        return activeModule.exports;
    }

    // Expose the raw module registry
    webpackRequire.m = modulesRegistry;

    // --- Webpack Runtime Helper Modules ---

    // AMD Options placeholder
    (() => {
        webpackRequire.amdO = {};
    })();

    // Compatibility getter for default exports
    (() => {
        webpackRequire.n = (module) => {
            const getter = module && module.__esModule ?
                () => module.default :
                () => module;
            webpackRequire.d(getter, { a: getter });
            return getter;
        };
    })();

    // Create a synthetic namespace object with prototype inspection
    (() => {
        const getPrototype = Object.getPrototypeOf ? 
            (obj) => Object.getPrototypeOf(obj) : 
            (obj) => obj.__proto__;
        
        let leafPrototypes;

        webpackRequire.t = function(value, mode) {
            if (mode & 1) value = this(value);
            if (mode & 8) return value;
            if (typeof value === 'object' && value !== null) {
                if ((mode & 4) && value.__esModule) return value;
                if ((mode & 16) && typeof value.then === 'function') return value;
            }
            
            const namespaceObject = Object.create(null);
            webpackRequire.r(namespaceObject);
            
            const propertyDefinitions = {};
            leafPrototypes = leafPrototypes || [null, getPrototype({}), getPrototype([]), getPrototype(getPrototype)];
            
            for (let current = (mode & 2) && value; typeof current === 'object' && !leafPrototypes.includes(current); current = getPrototype(current)) {
                const propertyNames = Object.getOwnPropertyNames(current);
                for (let i = 0, len = propertyNames.length; i < len; i++) {
                    const key = propertyNames[i];
                    propertyDefinitions[key] = (k => () => value[k])(key);
                }
            }
            
            propertyDefinitions.default = () => value;
            webpackRequire.d(namespaceObject, propertyDefinitions);
            return namespaceObject;
        };
    })();

    // Define property getters on exports
    (() => {
        webpackRequire.d = (exports, definition) => {
            for (const key in definition) {
                if (webpackRequire.o(definition, key) && !webpackRequire.o(exports, key)) {
                    Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
                }
            }
        };
    })();

    // Dynamic chunk loading aggregator
    (() => {
        webpackRequire.f = {};
        webpackRequire.e = (chunkId) => {
            const handlers = webpackRequire.f;
            const handlerKeys = Object.keys(handlers);
            const pendingPromises = [];
            
            for (let i = 0, len = handlerKeys.length; i < len; i++) {
                handlers[handlerKeys[i]](chunkId, pendingPromises);
            }
            
            return Promise.all(pendingPromises);
        };
    })();

    // Get JavaScript chunk filename resolver
    (() => {
        webpackRequire.u = (chunkId) => `${chunkId}.js`;
    })();

    // Get full hash generator
    (() => {
        webpackRequire.h = () => "01e0960730372e58";
    })();

    // Safe hasOwnProperty utility shorthand
    (() => {
        const hasOwnProperty = Object.prototype.hasOwnProperty;
        webpackRequire.o = (obj, prop) => hasOwnProperty.call(obj, prop);
    })();

    // Define ES module marker on exports
    (() => {
        webpackRequire.r = (exports) => {
            if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
            }
            Object.defineProperty(exports, '__esModule', { value: true });
        };
    })();

    // Node.js module environment decorator
    (() => {
        webpackRequire.nmd = (module) => {
            module.paths = [];
            if (!module.children) {
                module.children = [];
            }
            return module;
        };
    })();

    // Startup entrypoint execution handler
    (() => {
        webpackRequire.X = (result, chunkIds, fn) => {
            let moduleId = chunkIds;
            if (!fn) {
                chunkIds = result;
                fn = () => webpackRequire(webpackRequire.s = moduleId);
            }
            
            for (let i = 0, len = chunkIds.length; i < len; i++) {
                webpackRequire.e(chunkIds[i]);
            }
            
            const executionResult = fn();
            return executionResult === undefined ? result : executionResult;
        };
    })();

    // Synchronous/Asynchronous chunk loading implementation via Node require
    (() => {
        const installedChunks = {
            "webpack-runtime": 1
        };

        const installChunk = (chunk) => {
            const { modules: moreModules, ids: chunkIds, runtime } = chunk;
            
            for (const moduleId in moreModules) {
                if (webpackRequire.o(moreModules, moduleId)) {
                    webpackRequire.m[moduleId] = moreModules[moduleId];
                }
            }
            
            if (runtime) {
                runtime(webpackRequire);
            }
            
            for (let i = 0, len = chunkIds.length; i < len; i++) {
                installedChunks[chunkIds[i]] = 1;
            }
        };

        webpackRequire.f.require = (chunkId, promises) => {
            if (!installedChunks[chunkId]) {
                if ("webpack-runtime" !== chunkId) {
                    installChunk(require(`./${webpackRequire.u(chunkId)}`));
                } else {
                    installedChunks[chunkId] = 1;
                }
            }
        };

        module.exports = webpackRequire;
        webpackRequire.C = installChunk;
    })();

})();