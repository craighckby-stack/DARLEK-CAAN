/**
 * @file src/lib/telemetry.ts
 * @description EMG Core v49 - Sovereign Optimized Telemetry and Metrics Engine
 */

export type EvolutionPrimitive = string | number | boolean | null | undefined;
export type EvolutionEventValue = EvolutionPrimitive | EvolutionPrimitive[] | { [key: string]: unknown };

export interface EvolutionEventData {
  readonly [key: string]: EvolutionEventValue;
}

export interface SaturationMetrics {
  readonly [key: string]: number;
}

// Reusable replacer function to avoid closure allocation per JSON.stringify call
const serializeReplacer = (_key: string, value: unknown): unknown => {
  return typeof value === 'bigint' ? value.toString() : value;
};

/**
 * Safely serializes and logs an evolution telemetry event with high memory efficiency and strict type-safety.
 */
export const logEvolutionEvent = (event: string, data: EvolutionEventData): void => {
  let serialized: string;
  try {
    serialized = JSON.stringify(data, serializeReplacer) ?? 'null';
  } catch {
    serialized = '[Unserializable Data]';
  }
  
  // Direct console pipeline write optimized for minimal garbage collection overhead
  console.log(`[EVOLUTION_EVENT][${new Date().toISOString()}] ${event}: ${serialized}`);
};

/**
 * Calculates the total saturation score from numeric metrics with O(1) memory footprint and type-guard validation.
 */
export const calculateSaturationScore = (metrics: SaturationMetrics): number => {
  if (metrics === null || typeof metrics !== 'object') {
    return 0;
  }
  
  let total = 0;
  for (const key in metrics) {
    if (Object.prototype.hasOwnProperty.call(metrics, key)) {
      const val = metrics[key];
      if (typeof val === 'number' && Number.isFinite(val)) {
        total += val;
      }
    }
  }
  
  return total;
};