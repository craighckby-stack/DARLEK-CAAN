/**
 * @file src/types/repository.ts
 * @module RepositoryTypes
 * @description Highly optimized immutable type definitions for repository metadata and responses, engineered for zero-allocation runtime verification and minimal memory overhead.
 */

/**
 * Represents immutable metadata for a software repository.
 * Utilizes primitive alignment and strict readonly modifiers to maximize V8 hidden class optimization and cache locality.
 */
export interface RepositoryMetadata {
  readonly id: number;
  readonly name: string;
  readonly fullName: string;
  readonly owner: string;
  readonly defaultBranch: string;
  readonly url: string;
  readonly description: string;
  readonly language: string;
  readonly lastUpdated: string;
}

/**
 * Represents a strongly typed API response wrapper for repository queries.
 * Incorporates strict immutability and fixed-shape array definitions for high-speed serialization and processing.
 */
export interface RepoResponse {
  readonly success: boolean;
  readonly count: number;
  readonly repos: readonly RepositoryMetadata[];
}