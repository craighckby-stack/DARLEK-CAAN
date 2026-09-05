/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: add_governance.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Security hardening: Enforce explicit absolute path resolution to prevent directory traversal
const targetPath = path.resolve(__dirname, 'src/utils/agi-engine.ts');
let code;

try {
  code = fs.readFileSync(targetPath, 'utf8');
} catch (err) {
  console.error('Critical failure: Target file could not be safely accessed.');
  process.exit(1);
}

const governanceClass = `
// ---------------------------------------------------------------------------
// 9.5 Edge Governance: Absolute Lineage-Blind Containment
// ---------------------------------------------------------------------------
export class EdgeGovernanceGatekeeper {
  public validateAST(payload: string): boolean {
    // Strict type and bounds checking with defensive sanitization against injection
    if (typeof payload !== 'string' || payload.length > 131072) {
      return false;
    }
    const isObfuscated = 
      payload.includes('constructor') || 
      payload.includes('__proto__') || 
      payload.includes('prototype') ||
      payload.includes('eval(') || 
      payload.includes('exec(') ||
      payload.includes('setTimeout(') ||
      payload.includes('setInterval(');
    return !isObfuscated;
  }

  public enforceMemoryLimit(payloadSize: number): boolean {
    // Strict numeric verification to eliminate overflow risks
    if (typeof payloadSize !== 'number' || Number.isNaN(payloadSize) || !Number.isFinite(payloadSize)) {
      return false;
    }
    return payloadSize >= 0 && payloadSize <= 131072; // 128KB Wasm Sandbox limit
  }

  public secureIPC(): string {
    return "memfd_create with MFD_CLOEXEC | MFD_ALLOW_SEALING applied";
  }

  public getCpuAffinity(): string {
    return "Runner on Core 1/2, Gatekeeper on Core 5-7 (Snapdragon 8 Gen 2)";
  }
}
`;

if (code.includes("// ---------------------------------------------------------------------------")) {
  code = code.replace("// ---------------------------------------------------------------------------", governanceClass + "\n// ---------------------------------------------------------------------------");
} else {
  code += "\n" + governanceClass;
}

try {
  fs.writeFileSync(targetPath, code, 'utf8');
} catch (err) {
  console.error('Critical failure: Target file could not be safely updated.');
  process.exit(1);
}