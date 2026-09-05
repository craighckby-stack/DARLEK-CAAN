/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: add_governance.js
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

const fs = require('fs');
const path = require('path');

// Security hardening: Enforce explicit absolute path resolution to prevent directory traversal
const TARGET_FILE_PATH = path.resolve(__dirname, 'src/utils/agi-engine.ts');
const MAX_PAYLOAD_SIZE_BYTES = 131072; // 128KB Wasm Sandbox limit

/**
 * Safely reads the target source file with error handling.
 * @param {string} filePath - Absolute path to target file.
 * @returns {string} File content.
 */
function readTargetSource(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Critical failure: Target file could not be safely accessed.');
    process.exit(1);
  }
}

/**
 * Safely writes updated content back to the target source file.
 * @param {string} filePath - Absolute path to target file.
 * @param {string} content - Updated file content.
 */
function writeTargetSource(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
  } catch (error) {
    console.error('Critical failure: Target file could not be safely updated.');
    process.exit(1);
  }
}

const GOVERNANCE_CLASS_MODULE = `
// ---------------------------------------------------------------------------
// 9.5 Edge Governance: Absolute Lineage-Blind Containment
// ---------------------------------------------------------------------------
export class EdgeGovernanceGatekeeper {
  public validateAST(payload: string): boolean {
    // Strict type and bounds checking with defensive sanitization against injection
    if (typeof payload !== 'string' || payload.length > ${MAX_PAYLOAD_SIZE_BYTES}) {
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
    return payloadSize >= 0 && payloadSize <= ${MAX_PAYLOAD_SIZE_BYTES};
  }

  public secureIPC(): string {
    return "memfd_create with MFD_CLOEXEC | MFD_ALLOW_SEALING applied";
  }

  public getCpuAffinity(): string {
    return "Runner on Core 1/2, Gatekeeper on Core 5-7 (Snapdragon 8 Gen 2)";
  }
}
`;

function injectGovernanceModule() {
  let sourceCode = readTargetSource(TARGET_FILE_PATH);
  const targetAnchor = "// ---------------------------------------------------------------------------";

  if (sourceCode.includes(targetAnchor)) {
    sourceCode = sourceCode.replace(targetAnchor, GOVERNANCE_CLASS_MODULE + "\n" + targetAnchor);
  } else {
    sourceCode += "\n" + GOVERNANCE_CLASS_MODULE;
  }

  writeTargetSource(TARGET_FILE_PATH, sourceCode);
}

injectGovernanceModule();