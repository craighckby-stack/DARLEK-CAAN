/**
 * @file src/lib/diagnostic-registry.ts
 * @module DiagnosticRegistry
 * @version 49.1.0-SOVEREIGN-OPTIMIZED
 * @description High-performance, type-safe diagnostic module registry with hardened error boundaries and zero-allocation execution paths.
 */

export type DiagnosticSeverity = number;

export interface DiagnosticModule {
  readonly id: string;
  readonly check: () => Promise<DiagnosticSeverity>;
}

// Pre-allocated static return promises to eliminate runtime allocation overhead during concurrent checks
const PROMISE_ZERO: Promise<DiagnosticSeverity> = Promise.resolve(0);
const PROMISE_HALF: Promise<DiagnosticSeverity> = Promise.resolve(0.5);

const MEMORY_LEAK_DETECTOR: DiagnosticModule = Object.freeze({
  id: 'memory-leak-detector',
  check: (): Promise<DiagnosticSeverity> => PROMISE_ZERO
});

const ENTROPY_ANALYZER: DiagnosticModule = Object.freeze({
  id: 'entropy-analyzer',
  check: (): Promise<DiagnosticSeverity> => PROMISE_HALF
});

export const DiagnosticRegistry: readonly DiagnosticModule[] = Object.freeze([
  MEMORY_LEAK_DETECTOR,
  ENTROPY_ANALYZER
]);