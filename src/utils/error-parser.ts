/**
 * @file src/utils/error-parser.ts
 * @module EMG.Core.ErrorParser
 * @version 4.9.1
 * @description High-performance, type-safe system error parsing and normalization engine.
 */

export interface SystemErrorPayload {
  readonly operationType?: string;
  readonly error?: string;
  readonly path?: string;
  readonly [key: string]: unknown;
}

export interface ParsedSystemError {
  readonly isSystemError: boolean;
  readonly message: string;
  readonly path: string;
}

const FALLBACK_PATH = 'N/A' as const;
const UNKNOWN_ERROR_MSG = 'Unknown error occurred' as const;

const NULL_ERROR_RESULT: ParsedSystemError = {
  isSystemError: false,
  message: UNKNOWN_ERROR_MSG,
  path: FALL_BACK_PATH_SAFE()
};

function FALL_BACK_PATH_SAFE() {
  return FALLBACK_PATH;
}

/**
 * Parses an incoming Error object, extracting structured system error payloads if valid JSON,
 * or gracefully falling back to standard error representations with maximum memory and execution efficiency.
 *
 * @param {Error} error - The raw Error instance to parse.
 * @returns {ParsedSystemError} The normalized, type-safe error structure.
 */
export const parseSystemError = (error: Error): ParsedSystemError => {
  if (error === null || error === undefined) {
    return NULL_ERROR_RESULT;
  }

  const rawMessage = error.message;

  if (rawMessage === null || rawMessage === undefined || rawMessage.charCodeAt(0) !== 123) {
    return {
      isSystemError: false,
      message: rawMessage || UNKNOWN_ERROR_MSG,
      path: FALLBACK_PATH,
    };
  }

  try {
    const data = JSON.parse(rawMessage) as SystemErrorPayload;
    if (data !== null && typeof data === 'object') {
      const operationType = data.operationType;
      const isSystemError = typeof operationType === 'string' && operationType.length > 0;
      const errProp = data.error;
      const pathProp = data.path;

      return {
        isSystemError,
        message: (typeof errProp === 'string' && errProp) || rawMessage,
        path: (typeof pathProp === 'string' && pathProp) || FALLBACK_PATH,
      };
    }
  } catch {
    // Fall through on parsing failure
  }

  return {
    isSystemError: false,
    message: rawMessage,
    path: FALLBACK_PATH,
  };
};