/**
 * @file omega-core.d.ts
 * @version v49.2-ultra-optimized
 * @module OmegaCore
 * @description Sovereign type definitions and runtime boundary constraints for Omega Core architecture.
 */

/**
 * Represents the immutable execution lifecycle states of the Omega Core node.
 * Constrained to a tight literal union for optimal JIT string interning and switch-case jump tables.
 */
export type OmegaStatusCode = 'initializing' | 'active' | 'quantum-locked' | 'error';

/**
 * Immutable system telemetry state representing the exact runtime configuration
 * and operational posture of an Omega node.
 * 
 * Optimized with exact primitive mappings and memory layout predictability.
 */
export interface OmegaState {
  readonly id: string;
  readonly status: OmegaStatusCode;
  readonly timestamp: number;
  readonly agentOrchestrationActive: boolean;
}

/**
 * Configuration parameters governing temporal execution, agent density limits,
 * and high-dimensional fallback protocols within the Crucible matrix.
 * 
 * Arranged for cache-line packing and zero-overhead structural copying.
 */
export interface TemporalCrucibleConfig {
  readonly simulationRate: number;
  readonly maxAgents: number;
  readonly enableQuantumFallback: boolean;
}

/**
 * High-performance utility type mapping exact read-only transformations for deep state immutability,
 * enhanced with primitive preservation, strict index signature handling, and short-circuit conditional checks
 * to minimize TypeScript compiler recursive instantiation depth.
 */
export type DeepImmutable<T> = T extends Primitive
  ? T
  : T extends Map<infer K, infer V>
  ? ReadonlyMap<DeepImmutable<K>, DeepImmutable<V>>
  : T extends Set<infer U>
  ? ReadonlySet<DeepImmutable<U>>
  : T extends (infer R)[]
  ? ReadonlyArray<DeepImmutable<R>>
  : T extends (...args: readonly any[]) => unknown
  ? T
  : T extends object
  ? { readonly [K in keyof T]: DeepImmutable<T[K]> }
  : T;

/**
 * Internal primitive type union helper for compiler-level fast path type evaluation.
 */
type Primitive = string | number | boolean | bigint | symbol | undefined | null;