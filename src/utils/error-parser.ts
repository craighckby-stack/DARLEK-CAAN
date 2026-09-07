/**
 * @file src/utils/error-parser.ts
 * @module ErrorParser
 * @version 4.9.1
 * @description High-performance, type-safe system error parsing and normalization engine.
 */

/**
 * Expected shape of JSON-encoded error payloads produced by system operations.
 */
export interface SystemErrorPayload {
  readonly operationType?: string;
  readonly error?: string;
  readonly path?: string;
  readonly [key: string]: unknown;
}

/**
 * Normalized, type-safe representation of an error for application consumption.
 */
export interface ParsedSystemError {
  readonly isSystemError: boolean;
  readonly message: string;
  readonly path: string;
}

/** Default fallback values for unparsable or missing error details. */
const FALLBACK_PATH = 'N/A' as const;
const UNKNOWN_ERROR_MESSAGE = 'Unknown error occurred' as const;

/** Pre-allocated immutable default result for null or undefined error inputs. */
const NULL_ERROR_RESULT: ParsedSystemError = Object.freeze({
  isSystemError: false,
  message: UNKNOWN_ERROR_MESSAGE,
  path: FALLBACK_PATH,
});

/**
 * Type guard checking if a value is a non-empty string.
 */
const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.length > 0;

/**
 * Checks whether a raw message string is a potential JSON object (starts with '{').
 */
const isJsonCandidate = (message: string | undefined | null): message is string =>
  typeof message === 'string' && message.charCodeAt(0) === 123;

/**
 * Parses an incoming Error object, extracting structured system error payloads if valid JSON,
 * or gracefully falling back to standard error representations with maximum execution clarity.
 *
 * @param error - The raw Error instance to parse.
 * @returns The normalized, type-safe error structure.
 */
export const parseSystemError = (error: Error): ParsedSystemError => {
  if (!error) {
    return NULL_ERROR_RESULT;
  }

  const rawMessage = error.message;

  if (!isJsonCandidate(rawMessage)) {
    return {
      isSystemError: false,
      message: rawMessage || UNKNOWN_ERROR_MESSAGE,
      path: FALLBACK_PATH,
    };
  }

  try {
    const data = JSON.parse(rawMessage) as SystemErrorPayload;

    if (data && typeof data === 'object') {
      const { operationType, error: errorProp, path: pathProp } = data;
      const isSystemError = isNonEmptyString(operationType);

      return {
        isSystemError,
        message: isNonEmptyString(errorProp) ? errorProp : rawMessage,
        path: isNonEmptyString(pathProp) ? pathProp : FALLBACK_PATH,
      };
    }
  } catch {
    // Graceful fallback on JSON syntax or parsing failure
  }

  return {
    isSystemError: false,
    message: rawMessage,
    path: FALLBACK_PATH,
  };
};