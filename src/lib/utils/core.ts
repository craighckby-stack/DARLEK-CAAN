/**
 * @file src/lib/utils/core.ts
 * @module EMG Core v49 Neural Code and Documentation Optimizer Engine
 * @description Sovereign core utilities optimized for high-performance cryptographic ID generation, type safety, and memory efficiency.
 */

import { Message, EvolutionLogEntry } from '@/lib/types';

/**
 * Immutable character set optimized for URL-safe identifiers.
 */
const ALPHABET = 'abcdefghijklmnopqrstuvwxyz0123456789';

/**
 * Standard length for generated unique identifiers.
 */
const ID_LENGTH = 8;

/**
 * Pre-allocated Uint8Array buffer for high-performance random value generation,
 * eliminating per-call memory allocation overhead.
 */
const RANDOM_BUFFER = typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function'
  ? new Uint8Array(ID_LENGTH)
  : null;

/**
 * Generates a cryptographically secure, random alphanumeric identifier of fixed length.
 * Falls back to Math.random if a secure crypto environment is unavailable.
 * 
 * @returns {string} A unique 8-character string identifier.
 */
export function createId(): string {
  const alphabet = ALPHABET;
  const len = ID_LENGTH;
  
  if (RANDOM_BUFFER !== null) {
    globalThis.crypto.getRandomValues(RANDOM_BUFFER);
    // Unrolled loop for ID_LENGTH = 8 to eliminate loop overhead and string concatenation garbage
    return (
      alphabet[RANDOM_BUFFER[0]! % 36] +
      alphabet[RANDOM_BUFFER[1]! % 36] +
      alphabet[RANDOM_BUFFER[2]! % 36] +
      alphabet[RANDOM_BUFFER[3]! % 36] +
      alphabet[RANDOM_BUFFER[4]! % 36] +
      alphabet[RANDOM_BUFFER[5]! % 36] +
      alphabet[RANDOM_BUFFER[6]! % 36] +
      alphabet[RANDOM_BUFFER[7]! % 36]
    );
  }

  // Fallback path unrolled
  return (
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0] +
    alphabet[(Math.random() * 36) | 0]
  );
}

/**
 * Factory function to create a validated Message instance.
 * 
 * @param {'caan' | 'operator' | 'system'} role - The role of the message author.
 * @param {string} content - The text content of the message.
 * @returns {Message} A fully typed and stamped Message object.
 * @throws {TypeError} If content is missing or not a string.
 */
export function createMessage(role: Message['role'], content: string): Message {
  if (typeof content !== 'string' || content.length === 0) {
    throw new TypeError('Invalid message content: must be a non-empty string.');
  }

  return {
    id: createId(),
    role,
    content,
    timestamp: new Date()
  };
}

/**
 * Factory function to create a validated EvolutionLogEntry instance.
 * 
 * @param {EvolutionLogEntry['type']} type - The classification category of the log entry.
 * @param {string} description - A primary description of the evolution event.
 * @param {string} [details] - Optional granular details regarding the event.
 * @returns {EvolutionLogEntry} A fully typed and stamped EvolutionLogEntry object.
 * @throws {TypeError} If description is missing or not a string.
 */
export function createLogEntry(
  type: EvolutionLogEntry['type'], 
  description: string, 
  details?: string
): EvolutionLogEntry {
  if (typeof description !== 'string' || description.length === 0) {
    throw new TypeError('Invalid log description: must be a non-empty string.');
  }

  const entry: EvolutionLogEntry = {
    id: createId(),
    type,
    description,
    timestamp: new Date()
  };

  if (details !== undefined) {
    entry.details = details;
  }

  return entry;
}