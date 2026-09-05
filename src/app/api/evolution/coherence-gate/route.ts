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
  repoFiles?: string[];
  newFiles?: Array<{ path: string; content?: string }>;
}

interface ThresholdCheck {
  name: string;
  value: number;
  threshold: number;
  max: number;
  inverted: boolean;
}

export const dynamic = 'force-dynamic';

const MAX_SAFE_RISK_SCORE = 7;
const MAX_SAFE_AFFECTED_FILES = 5;
const MAX_WARNING_METRICS_TOLERANCE = 3;

function normalizeSaturation(saturation: SaturationMetrics = {}) {
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
  repoFiles: string[] = [],
  newFiles: Array<{ path: string; content?: string }> = []
): Promise<string[]> {
  if (!originalCode || !proposedCode || !filePath) {
    return [];
  }

  const sanity = await mainWorker.validateSanity(originalCode, proposedCode, filePath, repoFiles, newFiles);
  if (sanity.passed || !Array.isArray(sanity.violations)) {
    return [];
  }

  return sanity.violations
    .filter((violation) => violation.severity === 'high')
    .map((violation) => `STRUCTURAL SANITY BLOCK: ${violation.message}`);
}

function evaluateThresholds(saturation: ReturnType<typeof normalizeSaturation>): { failures: string[]; hasWarning: boolean } {
  const failures: string[] = [];
  let hasWarning = false;

  const checks: ThresholdCheck[] = [
    {
      name: 'Structural Change',
      value: saturation.structuralChange,
      threshold: SATURATION_THRESHOLDS.structuralChange.critical,
      max: SATURATION_THRESHOLDS.structuralChange.max,
      inverted: false,
    },
    {
      name: 'Semantic Saturation',
      value: saturation.semanticSaturation,
      threshold: SATURATION_THRESHOLDS.semanticSaturation.critical,
      max: SATURATION_THRESHOLDS.semanticSaturation.max,
      inverted: false,
    },
    {
      name: 'Velocity',
      value: saturation.velocity,
      threshold: SATURATION_THRESHOLDS.velocity.critical,
      max: SATURATION_THRESHOLDS.velocity.max,
      inverted: false,
    },
    {
      name: 'Identity Preservation',
      value: saturation.identityPreservation,
      threshold: SATURATION_THRESHOLDS.identityPreservation.critical,
      max: SATURATION_THRESHOLDS.identityPreservation.max,
      inverted: true,
    },
    {
      name: 'Cross-File Impact',
      value: saturation.crossFileImpact,
      threshold: SATURATION_THRESHOLDS.crossFileImpact.critical,
      max: SATURATION_THRESHOLDS.crossFileImpact.max,
      inverted: false,
    },
  ];

  for (const check of checks) {
    const isExceeded = check.inverted
      ? check.value <= check.threshold
      : check.value >= check.threshold;

    if (isExceeded) {
      failures.push(`${check.name} at critical level (${check.value}/${check.max}). System cannot absorb more change.`);
      hasWarning = true;
    }
  }

  return { failures, hasWarning };
}

function evaluateCumulativeStress(saturation: ReturnType<typeof normalizeSaturation>): { failures: string[]; hasWarning: boolean } {
  const warningChecks = [
    saturation.structuralChange >= SATURATION_THRESHOLDS.structuralChange.warning,
    saturation.semanticSaturation >= SATURATION_THRESHOLDS.semanticSaturation.warning,
    saturation.velocity >= SATURATION_THRESHOLDS.velocity.warning,
    saturation.identityPreservation <= SATURATION_THRESHOLDS.identityPreservation.warning,
    saturation.crossFileImpact >= SATURATION_THRESHOLDS.crossFileImpact.warning,
  ];

  const warningCount = warningChecks.filter(Boolean).length;
  if (warningCount >= MAX_WARNING_METRICS_TOLERANCE) {
    return {
      failures: [`Cumulative stress: ${warningCount}/5 metrics at warning level. System needs rest.`],
      hasWarning: true,
    };
  }

  return { failures: [], hasWarning: false };
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ status: 'online', service: 'EVOLUTION_COHERENCE_GATE_API' });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await safeReqJson<CoherenceGateBody>(req, {});
    const riskScore = typeof body.riskScore === 'number' ? body.riskScore : 0;
    const saturation = normalizeSaturation(body.saturation);
    const affectedFiles = Array.isArray(body.affectedFiles) ? body.affectedFiles : [];
    const { bypassGate, originalCode, proposedCode, filePath, repoFiles = [], newFiles = [] } = body;

    const failures: string[] = [];
    let saturationWarning = false;

    // Rule 0: Deterministic Structural Sanity Check (Non-bypassable)
    const sanityFailures = await collectSanityViolations(originalCode, proposedCode, filePath, repoFiles, newFiles);
    failures.push(...sanityFailures);

    if (bypassGate) {
      return NextResponse.json({
        passed: true,
        reason: failures.length > 0
          ? `COHERENCE GATE PASSED (OVERRIDE): Approved by operator with warnings [${failures.join('; ')}].`
          : 'COHERENCE GATE PASSED: Approved by system operator.',
        riskScore,
        saturationWarning: saturationWarning || failures.length > 0,
        failures: failures.length > 0 ? failures : undefined,
      } satisfies CoherenceGateResult & { failures?: string[] });
    }

    // Rule 1: Risk score check — block anything above threshold
    if (riskScore > MAX_SAFE_RISK_SCORE) {
      failures.push(`Risk score ${riskScore}/10 exceeds maximum threshold ${MAX_SAFE_RISK_SCORE}. Mutation DENIED.`);
    }

    // Rule 2: Saturation thresholds — check each metric
    const thresholdEvaluation = evaluateThresholds(saturation);
    failures.push(...thresholdEvaluation.failures);
    if (thresholdEvaluation.hasWarning) {
      saturationWarning = true;
    }

    // Rule 3: Cross-file impact — warn if many files affected
    if (affectedFiles.length > MAX_SAFE_AFFECTED_FILES) {
      failures.push(`Mutation affects ${affectedFiles.length} files — exceeds safe cross-file impact limit of ${MAX_SAFE_AFFECTED_FILES}.`);
      saturationWarning = true;
    }

    // Rule 4: Cumulative saturation stress — if multiple metrics hit warning level
    const cumulativeEvaluation = evaluateCumulativeStress(saturation);
    failures.push(...cumulativeEvaluation.failures);
    if (cumulativeEvaluation.hasWarning) {
      saturationWarning = true;
    }

    const result: CoherenceGateResult = {
      passed: failures.length === 0,
      reason: failures.length > 0
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