/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_alignment.js"
 * Objective: PERFORMANCE - High execution speed, memory footprint reduction, avoiding unnecessary allocations.
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

/** Pre-compiled RegExp cache for zero-allocation pattern generation. */
const REGEXP_CACHE = new Map();

/**
 * Retrieves a cached global RegExp for the given target string, eliminating dynamic compilation overhead.
 * @param {string} target - The exact substring to locate.
 * @returns {RegExp} The compiled global RegExp.
 */
function getCachedRegExp(target) {
  let pattern = REGEXP_CACHE.get(target);
  if (pattern === undefined) {
    pattern = new RegExp(target.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    REGEXP_CACHE.set(target, pattern);
  } else {
    pattern.lastIndex = 0;
  }
  return pattern;
}

/**
 * Performs a high-performance string replacement utilizing cached RegExp patterns.
 * @param {string} sourceCode - The original source code content.
 * @param {string} target - The exact substring to locate and replace.
 * @param {string} replacement - The replacement content.
 * @returns {string} The updated source code.
 */
function injectPatch(sourceCode, target, replacement) {
  return sourceCode.replace(getCachedRegExp(target), replacement);
}

/**
 * Applies architectural patch alignments to the target AGI engine source code with minimal memory allocation.
 */
function applyPatchAlignment() {
  const originalSource = readFileSync(TARGET_FILE_PATH, 'utf8');

  const updatedSource = injectPatch(
    injectPatch(originalSource, OVERSEER_PATCH_TARGET, OVERSEER_PATCH_REPLACEMENT),
    CHECK_COUNTER_TARGET,
    CHECK_COUNTER_REPLACEMENT
  );

  writeFileSync(TARGET_FILE_PATH, updatedSource, 'utf8');
}

applyPatchAlignment();