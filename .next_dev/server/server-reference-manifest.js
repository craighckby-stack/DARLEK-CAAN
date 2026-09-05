'use strict';

(function () {
  const globalContext = typeof self !== 'undefined'
    ? self
    : (typeof globalThis !== 'undefined' ? globalThis : this);

  if (globalContext) {
    globalContext.__RSC_SERVER_MANIFEST = "{\n  \"node\": {},\n  \"edge\": {},\n  \"encryptionKey\": \"process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY\"\n}";
  }
})();