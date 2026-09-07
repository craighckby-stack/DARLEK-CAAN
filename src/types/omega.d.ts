/**
 * @file src/types/omega.d.ts
 * @version 4.9.1-core-opt
 * @description Darlek Caan Neural Code Optimized Type Definitions for resilient task execution and deterministic outcomes.
 */

/**
 * Represents an immutable unit of work scheduled for execution within the engine.
 *
 * @template TPayload - The structured execution context or parameter map for the task.
 */
export interface Task<TPayload = Readonly<Record<string, unknown>>> {
  /** Unique deterministic identifier representing the task instance. */
  readonly id: string;

  /** Execution priority weight where higher numeric values indicate greater execution urgency. */
  readonly priority: number;

  /** Contextual execution payload associated with this task. */
  readonly payload: TPayload;
}

/**
 * Represents a successful computation outcome containing resolved data.
 *
 * @template TData - The type of data produced upon successful execution.
 */
export interface SuccessResult<TData = unknown> {
  readonly success: true;
  readonly data: TData;
  readonly error?: never;
}

/**
 * Represents an unsuccessful computation outcome containing failure diagnostics.
 *
 * @template TError - The type of error produced upon execution failure.
 */
export interface FailureResult<TError = Error | string> {
  readonly success: false;
  readonly data?: never;
  readonly error: TError;
}

/**
 * Discriminated union modeling the robust result of an operation that can either succeed or fail.
 *
 * @template TData - Type of data yielded upon success.
 * @template TError - Type of error yielded upon failure.
 */
export type Result<TData = unknown, TError = Error | string> =
  | Readonly<SuccessResult<TData>>
  | Readonly<FailureResult<TError>>;

/**
 * Teardown callback signature invoked to release resources or deregister subscriptions.
 */
export type Unsubscribe = () => void;