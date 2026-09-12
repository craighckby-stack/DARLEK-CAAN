/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/api/evolution/coherence-gate/route.ts
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { CoherenceGateResult } from '@/lib/types';
import { SATURATION_THRESHOLDS } from '@/lib/constants';
import { mainWorker } from '@/lib/main-worker';
import { safeReqJson } from '@/lib/safe-json';

interface SaturationMetrics {
  structuralChange?: number;
  semanticSaturation?: number;
  velocity?: number;
  identityPreservation?: number;
  capabilityAlignment?: number;
  crossFileImpact?: number;
}

interface CoherenceGateBody {
  riskScore?: number;
  saturation?: SaturationMetrics;
  affectedFiles?: string[];
  bypassGate?: boolean;
  originalCode?: string;
  proposedCode?: string;
  filePath?: string;
  repoFiles?: Array<{ path: string; content: string; [key: string]: any }>;
  newFiles?: Array<{ path: string; content: string; [key: string]: any }>;
}

export const dynamic = 'force-dynamic';

const MAX_SAFE_RISK_SCORE = 7;
const MAX_SAFE_AFFECTED_FILES = 5;
const MAX_WARNING_METRICS_TOLERANCE = 3;

const DEFAULT_SATURATION = Object.freeze({
  structuralChange: 0,
  semanticSaturation: 0,
  velocity: 0,
  identityPreservation: 1,
  capabilityAlignment: 1,
  crossFileImpact: 0,
});

interface NormalizedSaturation {
  structuralChange: number;
  semanticSaturation: number;
  velocity: number;
  identityPreservation: number;
  capabilityAlignment: number;
  crossFileImpact: number;
}

function normalizeSaturation(saturation: SaturationMetrics = {}): NormalizedSaturation {
  return {
    structuralChange: saturation.structuralChange ?? 0,
    semanticSaturation: saturation.semanticSaturation ?? 0,
    velocity: saturation.velocity ?? 0,
    identityPreservation: saturation.identityPreservation ?? 1,
    capabilityAlignment: saturation.capabilityAlignment ?? 1,
    crossFileImpact: saturation.crossFileImpact ?? 0,
  };
}

async function collectSanityViolations(
  originalCode?: string,
  proposedCode?: string,
  filePath?: string,
  repoFiles: Array<{ path: string; content: string; [key: string]: any }> = [],
  newFiles: Array<{ path: string; content: string; [key: string]: any }> = []
): Promise<string[]> {
  if (!originalCode || !proposedCode || !filePath) {
    return [];
  }

  const sanity = await mainWorker.validateSanity(originalCode, proposedCode, filePath, repoFiles, newFiles);
  if (sanity.passed || !Array.isArray(sanity.violations) || sanity.violations.length === 0) {
    return [];
  }

  return sanity.violations
    .filter((violation) => violation.severity === 'high')
    .map((violation) => `STRUCTURAL SANITY BLOCK: ${violation.message}`);
}

function evaluateThresholds(saturation: NormalizedSaturation): { failures: string[]; hasWarning: boolean } {
  const failures: string[] = [];
  let hasWarning = false;

  const checks = [
    { current: saturation.structuralChange, threshold: SATURATION_THRESHOLDS.structuralChange, name: 'Structural Change' },
    { current: saturation.semanticSaturation, threshold: SATURATION_THRESHOLDS.semanticSaturation, name: 'Semantic Saturation' },
    { current: saturation.velocity, threshold: SATURATION_THRESHOLDS.velocity, name: 'Velocity' },
    { current: saturation.identityPreservation, threshold: SATURATION_THRESHOLDS.identityPreservation, name: 'Identity Preservation', isInverse: true },
    { current: saturation.crossFileImpact, threshold: SATURATION_THRESHOLDS.crossFileImpact, name: 'Cross-File Impact' },
  ];

  for (const check of checks) {
    const isCritical = check.isInverse
      ? check.current <= check.threshold.critical
      : check.current >= check.threshold.critical;

    if (isCritical) {
      failures.push(`${check.name} at critical level (${check.current}/${check.threshold.max}). System cannot absorb more change.`);
      hasWarning = true;
    }
  }

  return { failures, hasWarning };
}

function evaluateCumulativeStress(saturation: NormalizedSaturation): { failures: string[]; hasWarning: boolean } {
  const warningCount = [
    saturation.structuralChange >= SATURATION_THRESHOLDS.structuralChange.warning,
    saturation.semanticSaturation >= SATURATION_THRESHOLDS.semanticSaturation.warning,
    saturation.velocity >= SATURATION_THRESHOLDS.velocity.warning,
    saturation.identityPreservation <= SATURATION_THRESHOLDS.identityPreservation.warning,
    saturation.crossFileImpact >= SATURATION_THRESHOLDS.crossFileImpact.warning,
  ].filter(Boolean).length;

  if (warningCount >= MAX_WARNING_METRICS_TOLERANCE) {
    return {
      failures: [`Cumulative stress: ${warningCount}/5 metrics at warning level. System needs rest.`],
      hasWarning: true,
    };
  }

  return { failures: [], hasWarning: false };
}

const ONLINE_RESPONSE = NextResponse.json({ status: 'online', service: 'EVOLUTION_COHERENCE_GATE_API' });

export async function GET(): Promise<NextResponse> {
  return ONLINE_RESPONSE;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeReqJson<CoherenceGateBody>(req, {});
    const riskScore = typeof body.riskScore === 'number' ? body.riskScore : 0;
    const saturation = normalizeSaturation(body.saturation);
    const affectedFiles = Array.isArray(body.affectedFiles) ? body.affectedFiles : [];
    const { bypassGate, originalCode, proposedCode, filePath } = body;
    const repoFiles = Array.isArray(body.repoFiles) ? body.repoFiles : [];
    const newFiles = Array.isArray(body.newFiles) ? body.newFiles : [];

    const failures: string[] = [];
    let saturationWarning = false;

    const sanityFailures = await collectSanityViolations(originalCode, proposedCode, filePath, repoFiles, newFiles);
    if (sanityFailures.length > 0) {
      failures.push(...sanityFailures);
    }

    if (bypassGate) {
      const hasFailures = failures.length > 0;
      const responseData: CoherenceGateResult & { failures?: string[] } = {
        passed: true,
        reason: hasFailures
          ? `COHERENCE GATE PASSED (OVERRIDE): Approved by operator with warnings [${failures.join('; ')}].`
          : 'COHERENCE GATE PASSED: Approved by system operator.',
        riskScore,
        saturationWarning: saturationWarning || hasFailures,
      };
      if (hasFailures) {
        responseData.failures = failures;
      }
      return NextResponse.json(responseData);
    }

    if (riskScore > MAX_SAFE_RISK_SCORE) {
      failures.push(`Risk score ${riskScore}/10 exceeds maximum threshold ${MAX_SAFE_RISK_SCORE}. Mutation DENIED.`);
    }

    const thresholdEvaluation = evaluateThresholds(saturation);
    if (thresholdEvaluation.failures.length > 0) {
      failures.push(...thresholdEvaluation.failures);
    }
    if (thresholdEvaluation.hasWarning) {
      saturationWarning = true;
    }

    if (affectedFiles.length > MAX_SAFE_AFFECTED_FILES) {
      failures.push(`Mutation affects ${affectedFiles.length} files — exceeds safe cross-file impact limit of ${MAX_SAFE_AFFECTED_FILES}.`);
      saturationWarning = true;
    }

    const cumulativeEvaluation = evaluateCumulativeStress(saturation);
    if (cumulativeEvaluation.failures.length > 0) {
      failures.push(...cumulativeEvaluation.failures);
    }
    if (cumulativeEvaluation.hasWarning) {
      saturationWarning = true;
    }

    const hasFailed = failures.length > 0;
    const result: CoherenceGateResult = {
      passed: !hasFailed,
      reason: hasFailed
        ? `COHERENCE GATE BLOCKED:\n${failures.join('\n')}`
        : 'COHERENCE GATE PASSED: All thresholds within safe limits. Mutation authorized.',
      riskScore,
      saturationWarning,
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Coherence gate error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { passed: false, reason: `Coherence gate error: ${errorMessage}`, riskScore: 0, saturationWarning: true },
      { status: 500 }
    );
  }
}