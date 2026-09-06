/**
 * @fileoverview Type definitions for repository entities and API response wrappers.
 * @module types/repository
 */

/**
 * Core metadata model representing a software source code repository.
 */
export interface RepositoryMetadata {
  /** Unique numeric identifier for the repository. */
  readonly id: number;

  /** Unqualified repository name. */
  readonly name: string;

  /** Fully qualified repository name including namespace/owner (e.g., "owner/repo"). */
  readonly fullName: string;

  /** Account username or organization name owning the repository. */
  readonly owner: string;

  /** Name of the repository's default branch (e.g., "main", "master"). */
  readonly defaultBranch: string;

  /** Canonical HTTP/HTTPS URL to the repository. */
  readonly url: string;

  /** Text description summarizing the repository's purpose. */
  readonly description: string;

  /** Primary programming language utilized within the repository. */
  readonly language: string;

  /** ISO-8601 formatted timestamp indicating when the repository was last updated. */
  readonly lastUpdated: string;
}

/**
 * Standardized API response container for repository list queries.
 */
export interface RepoResponse {
  /** Indicates whether the repository query completed successfully. */
  readonly success: boolean;

  /** Total number of repository items included in the response payload. */
  readonly count: number;

  /** Immutable collection of retrieved repository metadata objects. */
  readonly repos: readonly RepositoryMetadata[];
}