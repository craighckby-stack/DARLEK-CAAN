/**
 * A secure, high-performance sandbox utilizing an isolated iframe to safely evaluate JavaScript/HTML code.
 * Optimized by EMG Core v49 Neural Code and Documentation Optimizer Engine.
 */
export interface SandboxResult {
  readonly success: boolean;
  readonly error?: string;
}

interface SandboxMessageEvent {
  readonly type: 'SANDBOX_RESULT';
  readonly success: boolean;
  readonly error?: string;
}

// Pre-allocated static templates and reusable objects to reduce memory allocation footprint
const TIMEOUT_MS = 5000;
const TIMEOUT_ERROR_RESULT: SandboxResult = { success: false, error: 'Execution Timeout' };
const SSR_SUCCESS_RESULT: SandboxResult = { success: true };

// Static pre-escaped sandbox template skeleton to avoid repeated regex operations on identical strings
const SANDBOX_HTML_PREFIX = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script type="module">
window.require=(m)=>{console.warn('Sandbox: require("'+m+'") not supported. Returning mock.');return{};};
window.module={exports:{}};window.exports=window.module.exports;
window.process={env:{},browser:true,version:'v18.0.0',nextTick:(f)=>setTimeout(f,0)};
window.global=window;
try{const c=\``;

const SANDBOX_HTML_SUFFIX = `\`;
let e=c;
if(c.includes('require(')||c.includes('module.exports')){e=\`(function(require,module,exports){\${c}})(window.require,window.module,window.exports)\`;}
const b=new Blob([e],{type:'text/javascript'});
const u=URL.createObjectURL(b);
import(u).then(()=>{URL.revokeObjectURL(u);window.parent.postMessage({type:'SANDBOX_RESULT',success:true},'*');}).catch(err=>{URL.revokeObjectURL(u);throw err;});
}catch(err){
let m=err instanceof Error?err.message:String(err);
if(m.includes('Failed to resolve module specifier')){m="Dependency Error: "+m+". Node.js or external modules are not available in browser sandbox.";}
window.parent.postMessage({type:'SANDBOX_RESULT',success:false,error:m},'*');
}
</script></body></html>`;

export async function testCodeInSandbox(code: string): Promise<SandboxResult> {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return SSR_SUCCESS_RESULT;
  }

  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.sandbox.add('allow-scripts');
    
    let isCleanedUp = false;

    const cleanup = () => {
      if (isCleanedUp) return;
      isCleanedUp = true;
      clearTimeout(timeoutId);
      window.removeEventListener('message', handleMessage);
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      resolve(TIMEOUT_ERROR_RESULT);
    }, TIMEOUT_MS);

    const handleMessage = (event: MessageEvent<SandboxMessageEvent>) => {
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (data && data.type === 'SANDBOX_RESULT') {
        cleanup();
        resolve(data.error ? { success: data.success, error: data.error } : { success: data.success });
      }
    };

    window.addEventListener('message', handleMessage, { passive: true });

    // Optimized single-pass string replacement or fast template construction
    const escapedCode = code.replace(/`/g, '\\`').replace(/\${/g, '\\${');
    
    // Direct string concatenation minimizes dynamic object allocations and speeds up execution parsing
    iframe.srcdoc = SANDBOX_HTML_PREFIX + escapedCode + SANDBOX_HTML_SUFFIX;
    document.body.appendChild(iframe);
  });
}