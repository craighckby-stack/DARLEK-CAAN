/**
 * @file src/app/api/brain/types.ts
 * @module NeuralCode/BrainTypes
 * @version 49.2.0
 * @description Sovereign type definitions for neural mutations and cognitive health metrics.
 */

/**
 * Represents the current execution lifecycle status of a neural code mutation.
 * @public
 */
export type MutationStatus = 'pending' | 'applied' | 'rejected';

/**
 * Immutable payload structure describing a code mutation event.
 * Enforces strict readonly boundaries for optimal memory efficiency and state predictability.
 * @public
 */
export interface MutationPayload {
  readonly sessionId: string;
  readonly filePath: string;
  readonly status: MutationStatus;
  readonly riskScore: number;
  readonly analysis: string;
}

/**
 * Quantitative telemetry metrics measuring structural integrity and semantic health.
 * @public
 */
export interface HealthMetrics {
  readonly structuralChange: number;
  readonly semanticSaturation: number;
  readonly velocity: number;
  readonly identityPreservation: number;
  readonly capabilityAlignment: number;
  readonly crossFileImpact: number;
}