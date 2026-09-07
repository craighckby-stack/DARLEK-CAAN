/**
 * @file src/types/evolution.ts
 * @module Darlek Caan
 * @description Type-safe structural contracts for quantum state vectors and evolution history snapshots.
 */

/**
 * Generic dictionary type representing the internal state mapping of a quantum node.
 */
export type QuantumNodeState = Record<string, unknown>;

/**
 * Represents a high-performance quantum node with strict state typing and asynchronous collapse handling.
 *
 * @template TState - Structure of the internal state vector contained by the node.
 */
export interface IQuantumNode<TState extends QuantumNodeState = QuantumNodeState> {
  /**
   * Immutable state vector describing the current superposition or resolved state.
   */
  readonly stateVector: Readonly<TState>;

  /**
   * Unique identifier designating the entanglement channel or peer relationship.
   */
  readonly entanglementKey: string;

  /**
   * Asynchronously triggers quantum state collapse into a finalized baseline.
   *
   * @returns A promise that resolves once state stabilization is complete.
   */
  collapse(): Promise<void>;
}

/**
 * Represents an immutable snapshot capturing discrete evolutionary system transitions.
 */
export interface EvolutionSnapshot {
  /**
   * Milliseconds elapsed since Unix epoch at the instant the snapshot was recorded.
   */
  readonly timestamp: number;

  /**
   * Cryptographic digest or hash verifying state integrity at this snapshot boundary.
   */
  readonly checksum: string;

  /**
   * Read-only collection of file paths modified or affected during this evolutionary cycle.
   */
  readonly affectedFiles: readonly string[];
}