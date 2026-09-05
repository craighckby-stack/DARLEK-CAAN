/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_alignment.js"
 * Objective: Enhance READABILITY via modern idioms, descriptive naming, and modular decomposition.
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

/** Target source file path for the AGI engine patch alignment. */
const TARGET_FILE_PATH = 'src/utils/agi-engine.ts';

/** Code injection for initializing the Edge Governance Gatekeeper dependency. */
const OVERSEER_PATCH_TARGET = 'public overseer = new OverseerQueue();';
const OVERSEER_PATCH_REPLACEMENT = `${OVERSEER_PATCH_TARGET}\n  public edgeGovernance = new EdgeGovernanceGatekeeper();`;

/** Code injection for enforcing Layer 0 Edge Governance checks during validation cycles. */
const CHECK_COUNTER_TARGET = 'this.totalChecks++;';
const EDGE_GOVERNANCE_VALIDATION_BLOCK = `
    // Layer 0: Edge Governance AST & Memory Gatekeeper
    if (!this.edgeGovernance.validateAST(name) || !this.edgeGovernance.enforceMemoryLimit(name.length)) {
      this.blockedCount++;
      return {
        allowed: false,
        severity: 1.0,
        explanation: { humanReadable: 'L0 Edge Governance Blocked: Prototype-climbing / Memory limit exceeded.' }
      };
    }`;
const CHECK_COUNTER_REPLACEMENT = `${CHECK_COUNTER_TARGET}\n${EDGE_GOVERNANCE_VALIDATION_BLOCK}`;

/**
 * Escapes special regex characters in a string for safe RegExp construction.
 * @param {string} rawString - The raw string to escape.
 * @returns {string} The escaped safe string.
 */
function escapeRegExp(rawString) {
  return rawString.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Performs a safe string replacement on source code utilizing escaped targets.
 * @param {string} sourceCode - The original source code content.
 * @param {string} target - The exact substring to locate and replace.
 * @param {string} replacement - The replacement content.
 * @returns {string} The updated source code.
 */
function injectPatch(sourceCode, target, replacement) {
  const pattern = new RegExp(escapeRegExp(target), 'g');
  return sourceCode.replace(pattern, replacement);
}

/**
 * Applies architectural patch alignments to the target AGI engine source code.
 */
function applyPatchAlignment() {
  const originalSource = readFileSync(TARGET_FILE_PATH, 'utf8');

  let updatedSource = injectPatch(originalSource, OVERSEER_PATCH_TARGET, OVERSEER_PATCH_REPLACEMENT);
  updatedSource = injectPatch(updatedSource, CHECK_COUNTER_TARGET, CHECK_COUNTER_REPLACEMENT);

  writeFileSync(TARGET_FILE_PATH, updatedSource, 'utf8');
}

applyPatchAlignment();