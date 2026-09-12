/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_alignment.js"
 * Objective: COMPREHENSIVE - Sovereign Overhaul (Performance, Memory Efficiency, Error Handling, Type Safety via JSDoc)
 */

'use strict';

const { readFileSync, writeFileSync } = require('node:fs');

/** Target source file path for the cognitive engine patch alignment. @type {string} */
const TARGET_FILE_PATH = 'src/utils/agi-engine.ts';

/** Code injection for initializing the Edge Governance Gatekeeper dependency. @type {string} */
const OVERSEER_PATCH_TARGET = 'public overseer = new OverseerQueue();';
const OVERSEER_PATCH_REPLACEMENT = `${OVERSEER_PATCH_TARGET}\n  public edgeGovernance = new EdgeGovernanceGatekeeper();`;

/** Code injection for enforcing Layer 0 Edge Governance checks during validation cycles. @type {string} */
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
 * Internal LRU-style bounded cache for compiled regular expression patterns to prevent memory leakage.
 * @type {Map<string, RegExp>} 
 */
const regularExpressionCache = new Map();
const MAX_CACHE_SIZE = 100;

/**
 * Escapes special regular expression characters within a target string safely.
 * @param {string} stringValue - The string to escape.
 * @returns {string} The safely escaped string.
 * @throws {TypeError} If stringValue is not a valid string.
 */
function escapeRegExpSpecialCharacters(stringValue) {
  if (typeof stringValue !== 'string') {
    throw new TypeError('Expected a string value for regular expression escaping.');
  }
  return stringValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Retrieves a cached global regular expression for the given target string with memory bounds enforcement.
 * @param {string} targetSubstring - The exact substring to locate.
 * @returns {RegExp} The compiled global RegExp instance.
 */
function getCachedGlobalRegExp(targetSubstring) {
  let compiledRegExp = regularExpressionCache.get(targetSubstring);
  
  if (!compiledRegExp) {
    if (regularExpressionCache.size >= MAX_CACHE_SIZE) {
      const oldestKey = regularExpressionCache.keys().next().value;
      regularExpressionCache.delete(oldestKey);
    }
    const escapedPattern = escapeRegExpSpecialCharacters(targetSubstring);
    compiledRegExp = new RegExp(escapedPattern, 'g');
    regularExpressionCache.set(targetSubstring, compiledRegExp);
  }

  compiledRegExp.lastIndex = 0;
  return compiledRegExp;
}

/**
 * Applies a code injection patch to the source content using cached regular expressions.
 * @param {string} sourceCode - The original source code content.
 * @param {string} targetSubstring - The exact substring to locate and replace.
 * @param {string} replacementContent - The replacement content.
 * @returns {string} The modified source code.
 */
function injectPatch(sourceCode, targetSubstring, replacementContent) {
  const matchingPattern = getCachedGlobalRegExp(targetSubstring);
  return sourceCode.replace(matchingPattern, replacementContent);
}

/**
 * Reads, updates, and writes back the architectural patch alignments to the target AGI engine source file
 * with robust error handling for I/O operations.
 * @throws {Error} If file reading, patching, or writing fails.
 */
function applyPatchAlignment() {
  try {
    const originalSourceCode = readFileSync(TARGET_FILE_PATH, 'utf8');

    const sourceWithOverseer = injectPatch(
      originalSourceCode,
      OVERSEER_PATCH_TARGET,
      OVERSEER_PATCH_REPLACEMENT
    );

    const fullyPatchedSource = injectPatch(
      sourceWithOverseer,
      CHECK_COUNTER_TARGET,
      CHECK_COUNTER_REPLACEMENT
    );

    writeFileSync(TARGET_FILE_PATH, fullyPatchedSource, 'utf8');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`[EMG Core v49] Patch alignment failed for "${TARGET_FILE_PATH}": ${errorMessage}`);
  }
}

applyPatchAlignment();