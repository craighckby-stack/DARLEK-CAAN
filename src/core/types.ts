/**
 * Represents the operational lifecycle phases of a quantum node.
 */
export const enum QuantumNodeState {
  STABLE = 0,
  MUTATING = 1,
  CRITICAL = 2,
}

/**
 * Defines the foundational contract for an executable quantum processing node.
 * 
 * @template TInput - The expected input payload type for execution.
 * @template TOutput - The resulting output payload type from execution.
 */
export interface QuantumNode<TInput = unknown, TOutput = unknown> {
  readonly id: string;
  readonly state: QuantumNodeState;
  
  /**
   * Executes the node's core operational logic asynchronously.
   */
  execute(input: TInput): Promise<TOutput>;
  
  /**
   * Safely deconstructs and releases system resources allocated by the node.
   */
  teardown(): void | Promise<void>;
}

/**
 * Encapsulates the metrics and execution telemetry resulting from an evolution cycle.
 */
export interface EvolutionResult {
  readonly success: boolean;
  readonly logs: readonly string[];
  readonly timestamp: number;
}