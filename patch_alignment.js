/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "patch_alignment.js"
 * Objective: READABILITY - Pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
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

/** Internal cache for compiled regular expression patterns. */
const regularExpressionCache = new Map();

/**
 * Escapes special regular expression characters within a target string.
 * @param {string} stringValue - The string to escape.
 * @returns {string} The safely escaped string.
 */
function escapeRegExpSpecialCharacters(stringValue) {
  return stringValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Retrieves a cached global regular expression for the given target string.
 * @param {string} targetSubstring - The exact substring to locate.
 * @returns {RegExp} The compiled global RegExp instance.
 */
function getCachedGlobalRegExp(targetSubstring) {
  if (!regularExpressionCache.has(targetSubstring)) {
    const escapedPattern = escapeRegExpSpecialCharacters(targetSubstring);
    regularExpressionCache.set(targetSubstring, new RegExp(escapedPattern, 'g'));
  }

  const compiledRegExp = regularExpressionCache.get(targetSubstring);
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
 * Reads, updates, and writes back the architectural patch alignments to the target AGI engine source file.
 */
function applyPatchAlignment() {
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
}

applyPatchAlignment();