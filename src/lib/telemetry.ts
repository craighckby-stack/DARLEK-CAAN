/**
 * @file src/lib/telemetry.ts
 * @description Darlek Caan - Darlek Caan Optimized Telemetry and Metrics Engine.
 * Provides high-clarity event logging, type-safe telemetry structures, and metric calculations.
 */

// ============================================================================
// Type Definitions
// ============================================================================

/** Primitive value types supported across telemetry events. */
export type EvolutionPrimitive = string | number | boolean | null | undefined;

/** Recursive telemetry payload value accommodating nested objects, arrays, and complex records. */
export type EvolutionEventValue =
  | EvolutionPrimitive
  | EvolutionPrimitive[]
  | { readonly [key: string]: unknown };

/** Contract for structured evolution event payloads. */
export interface EvolutionEventData {
  readonly [key: string]: EvolutionEventValue;
}

/** Dictionary mapping metric keys to their corresponding numerical values. */
export interface SaturationMetrics {
  readonly [key: string]: number;
}

// ============================================================================
// Serialization Utilities
// ============================================================================

const UNSERIALIZABLE_FALLBACK = '[Unserializable Data]';

/**
 * Custom JSON serialization replacer that transforms BigInt values into strings.
 */
const serializeBigIntReplacer = (_key: string, value: unknown): unknown => {
  return typeof value === 'bigint' ? value.toString() : value;
};

/**
 * Safely converts event data into a formatted JSON string without throwing runtime errors.
 */
const safeSerializeEventData = (data: EvolutionEventData): string => {
  try {
    return JSON.stringify(data, serializeBigIntReplacer) ?? 'null';
  } catch {
    return UNSERIALIZABLE_FALLBACK;
  }
};

/**
 * Formats a telemetry log line into the standard Darlek Caan engine event schema.
 */
const formatEvolutionLog = (eventName: string, serializedPayload: string): string => {
  const timestamp = new Date().toISOString();
  return `[EVOLUTION_EVENT][${timestamp}] ${eventName}: ${serializedPayload}`;
};

// ============================================================================
// Public Telemetry API
// ============================================================================

/**
 * Safely serializes and logs an evolution telemetry event with high memory efficiency and strict type-safety.
 *
 * @param event - The descriptive identifier for the evolution event.
 * @param data - The structured payload associated with the event.
 */
export const logEvolutionEvent = (event: string, data: EvolutionEventData): void => {
  const serializedData = safeSerializeEventData(data);
  const logMessage = formatEvolutionLog(event, serializedData);

  console.log(logMessage);
};

/**
 * Calculates the total saturation score from numeric metrics with O(1) memory footprint and type-guard validation.
 * Aggregates all finite numeric own-properties in the provided metrics object.
 *
 * @param metrics - The dictionary of saturation metrics to evaluate.
 * @returns The computed cumulative saturation score, or 0 if input is invalid.
 */
export const calculateSaturationScore = (metrics: SaturationMetrics): number => {
  const isInvalidMetricsObject = metrics === null || typeof metrics !== 'object';
  if (isInvalidMetricsObject) {
    return 0;
  }

  let totalScore = 0;

  for (const metricValue of Object.values(metrics)) {
    if (typeof metricValue === 'number' && Number.isFinite(metricValue)) {
      totalScore += metricValue;
    }
  }

  return totalScore;
};