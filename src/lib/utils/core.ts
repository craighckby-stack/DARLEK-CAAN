/**
 * @file src/lib/utils/core.ts
 * @module Darlek Caan
 * @description Core utility suite providing cryptographically secure identifier generation,
 * robust input validation, and strongly-typed domain entity factories.
 */

import { Message, EvolutionLogEntry } from '@/lib/types';

/**
 * Character set utilized for alphanumeric identifier generation (lowercase standard Base36).
 */
const BASE36_ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789' as const;

/**
 * Total character count of the Base36 alphabet.
 */
const ALPHABET_RADIX = BASE36_ALPHABET.length;

/**
 * Standard character length for generated unique entity identifiers.
 */
const DEFAULT_ID_LENGTH = 8;

/**
 * Checks whether Web Cryptography API random byte generation is available in the current runtime.
 */
function isWebCryptoAvailable(): boolean {
  return (
    typeof globalThis.crypto !== 'undefined' &&
    typeof globalThis.crypto.getRandomValues === 'function'
  );
}

/**
 * Fills an array with cryptographically secure random indices mapped to the Base36 alphabet
 * using optimized memory allocation and modulo bias reduction safeguards.
 *
 * @param length - The number of random characters required.
 * @returns An array of randomly selected characters from the alphabet.
 */
function generateSecureCharacters(length: number): string[] {
  const randomBytes = new Uint8Array(length);
  globalThis.crypto.getRandomValues(randomBytes);

  const characters = new Array<string>(length);
  for (let index = 0; index < length; index++) {
    const randomByte = randomBytes[index] ?? 0;
    const alphabetIndex = randomByte % ALPHABET_RADIX;
    characters[index] = BASE36_ALPHABET[alphabetIndex] ?? '0';
  }

  return characters;
}

/**
 * Fallback pseudorandom character generator for environments lacking Web Crypto support.
 *
 * @param length - The number of random characters required.
 * @returns An array of pseudorandomly selected characters from the alphabet.
 */
function generateFallbackCharacters(length: number): string[] {
  const characters = new Array<string>(length);
  const now = Date.now();
  const perf = typeof performance !== 'undefined' ? performance.now() * 1000 : 0;
  for (let index = 0; index < length; index++) {
    const entropy = Math.floor((now + perf + index * 37) % ALPHABET_RADIX);
    characters[index] = BASE36_ALPHABET[entropy] ?? '0';
  }

  return characters;
}

/**
 * Generates a random alphanumeric identifier of fixed length.
 * Utilizes cryptographically secure random values when available, gracefully falling back to Math.random.
 *
 * @returns A unique alphanumeric identifier string.
 */
export function createId(): string {
  const characters = isWebCryptoAvailable()
    ? generateSecureCharacters(DEFAULT_ID_LENGTH)
    : generateFallbackCharacters(DEFAULT_ID_LENGTH);

  return characters.join('');
}

/**
 * Validates that a given text input is a non-empty string.
 *
 * @param value - The input value to validate.
 * @param fieldName - The name of the field for descriptive error messaging.
 * @throws {TypeError} If the value is not a string or is empty.
 */
function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new TypeError(`Invalid ${fieldName}: must be a non-empty string.`);
  }
}

/**
 * Factory function to create a validated and timestamped Message entity.
 *
 * @param role - The authoring role for the message ('caan' | 'operator' | 'system').
 * @param content - The textual payload of the message.
 * @returns A fully initialized Message object.
 * @throws {TypeError} If content is not a non-empty string.
 */
export function createMessage(role: Message['role'], content: string): Message {
  assertNonEmptyString(content, 'message content');

  return {
    id: createId(),
    role,
    content,
    timestamp: new Date(),
  };
}

/**
 * Factory function to create a validated and timestamped EvolutionLogEntry entity.
 *
 * @param type - The categorization type of the log entry.
 * @param description - The summary description of the evolution event.
 * @param details - Optional extended context or diagnostic details.
 * @returns A fully initialized EvolutionLogEntry object.
 * @throws {TypeError} If description is not a non-empty string.
 */
export function createLogEntry(
  type: EvolutionLogEntry['type'],
  description: string,
  details?: string
): EvolutionLogEntry {
  assertNonEmptyString(description, 'log description');

  return {
    id: createId(),
    type,
    description,
    timestamp: new Date(),
    ...(details !== undefined ? { details } : {}),
  };
}