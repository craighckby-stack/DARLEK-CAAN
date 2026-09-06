/**
 * EMG Core v49 Neural Code and Documentation Optimizer Engine
 * File Path: "src/lib/diagnostic-utils.ts"
 * Optimized for maximum performance, strict type safety, zero memory waste, and robust execution.
 */

const EVOLUTION_PREFIX = '[DARLEK-CANN-EVOLUTION]';
const INVALID_MSG_WARNING = `${EVOLUTION_PREFIX}: Invalid message type passed to logEvolution`;

// Cached regex to prevent redundant allocations during high-frequency parsing
const COMMENT_REGEX = /\/\/[^\r\n]*(\r?\n|$)/g;

/**
 * Logs an evolution diagnostic message with a standardized prefix.
 * 
 * @param {string} msg - The message to log.
 * @returns {void}
 */
export const logEvolution = (msg: string): void => {
  if (typeof msg !== 'string') {
    console.warn(INVALID_MSG_WARNING);
    return;
  }
  console.log(`${EVOLUTION_PREFIX}: ${msg}`);
};

/**
 * Sanitizes source code by removing single-line comments efficiently.
 * Uses a pre-compiled regex and early exits for memory and CPU optimization.
 * 
 * @param {string} code - The source code string to sanitize.
 * @returns {string} The sanitized source code without single-line comments.
 */
export const sanitizeCode = (code: string): string => {
  if (typeof code !== 'string' || code.length === 0) {
    return '';
  }
  return code.replace(COMMENT_REGEX, '$1');
};