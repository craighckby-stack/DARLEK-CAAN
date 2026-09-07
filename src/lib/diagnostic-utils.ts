/**
 * Darlek Caan
 * File Path: "src/lib/diagnostic-utils.ts"
 * Optimized for pristine modern idioms, descriptive naming, modular decomposition, and clean architectural clarity.
 */

const EVOLUTION_LOG_PREFIX = '[DARLEK-CANN-EVOLUTION]';
const INVALID_MESSAGE_WARNING = `${EVOLUTION_LOG_PREFIX}: Invalid message type passed to logEvolution`;

// Cached regex to prevent redundant allocations during high-frequency parsing
const SINGLE_LINE_COMMENT_PATTERN = /\/\/[^\r\n]*(\r?\n|$)/g;

/**
 * Validates whether a given value is a non-empty string.
 */
const isValidString = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0;
};

/**
 * Logs an evolution diagnostic message with a standardized prefix.
 * 
 * @param message - The diagnostic message to record.
 */
export const logEvolution = (message: string): void => {
  if (!isValidString(message)) {
    console.warn(INVALID_MESSAGE_WARNING);
    return;
  }
  
  console.log(`${EVOLUTION_LOG_PREFIX}: ${message}`);
};

/**
 * Sanitizes source code by removing single-line comments efficiently.
 * 
 * @param sourceCode - The raw source code string to sanitize.
 * @returns The sanitized source code devoid of single-line comments.
 */
export const sanitizeCode = (sourceCode: string): string => {
  if (!isValidString(sourceCode)) {
    return '';
  }
  
  return sourceCode.replace(SINGLE_LINE_COMMENT_PATTERN, '$1');
};