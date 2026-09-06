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

type NormalizedSaturation = typeof DEFAULT_SATURATION;

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
  repoFiles: string[] = [],
  newFiles: Array<{ path: string; content?: string }> = []
): Promise<string[]> {
  if (!originalCode || !proposedCode || !filePath) {
    return [];
  }

  const sanity = await mainWorker.validateSanity(originalCode, proposedCode, filePath, repoFiles, newFiles);
  if (sanity.passed || !Array.isArray(sanity.violations) || sanity.violations.length === 0) {
    return [];
  }

  const violations = sanity.violations;
  const len = violations.length;
  const result: string[] = [];

  for (let i = 0; i < len; i++) {
    const v = violations[i];
    if (v.severity === 'high') {
      result.push(`STRUCTURAL SANITY BLOCK: ${v.message}`);
    }
  }

  return result;
}

function evaluateThresholds(saturation: NormalizedSaturation): { failures: string[]; hasWarning: boolean } {
  const failures: string[] = [];
  let hasWarning = false;

  const tStruct = SATURATION_THRESHOLDS.structuralChange;
  if (saturation.structuralChange >= tStruct.critical) {
    failures.push(`Structural Change at critical level (${saturation.structuralChange}/${tStruct.max}). System cannot absorb more change.`);
    hasWarning = true;
  }

  const tSemantic = SATURATION_THRESHOLDS.semanticSaturation;
  if (saturation.semanticSaturation >= tSemantic.critical) {
    failures.push(`Semantic Saturation at critical level (${saturation.semanticSaturation}/${tSemantic.max}). System cannot absorb more change.`);
    hasWarning = true;
  }

  const tVelocity = SATURATION_THRESHOLDS.velocity;
  if (saturation.velocity >= tVelocity.critical) {
    failures.push(`Velocity at critical level (${saturation.velocity}/${tVelocity.max}). System cannot absorb more change.`);
    hasWarning = true;
  }

  const tIdentity = SATURATION_THRESHOLDS.identityPreservation;
  if (saturation.identityPreservation <= tIdentity.critical) {
    failures.push(`Identity Preservation at critical level (${saturation.identityPreservation}/${tIdentity.max}). System cannot absorb more change.`);
    hasWarning = true;
  }

  const tCross = SATURATION_THRESHOLDS.crossFileImpact;
  if (saturation.crossFileImpact >= tCross.critical) {
    failures.push(`Cross-File Impact at critical level (${saturation.crossFileImpact}/${tCross.max}). System cannot absorb more change.`);
    hasWarning = true;
  }

  return { failures, hasWarning };
}

function evaluateCumulativeStress(saturation: NormalizedSaturation): { failures: string[]; hasWarning: boolean } {
  let warningCount = 0;

  if (saturation.structuralChange >= SATURATION_THRESHOLDS.structuralChange.warning) warningCount++;
  if (saturation.semanticSaturation >= SATURATION_THRESHOLDS.semanticSaturation.warning) warningCount++;
  if (saturation.velocity >= SATURATION_THRESHOLDS.velocity.warning) warningCount++;
  if (saturation.identityPreservation <= SATURATION_THRESHOLDS.identityPreservation.warning) warningCount++;
  if (saturation.crossFileImpact >= SATURATION_THRESHOLDS.crossFileImpact.warning) warningCount++;

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
    const { bypassGate, originalCode, proposedCode, filePath, repoFiles = [], newFiles = [] } = body;

    const failures: string[] = [];
    let saturationWarning = false;

    const sanityFailures = await collectSanityViolations(originalCode, proposedCode, filePath, repoFiles, newFiles);
    if (sanityFailures.length > 0) {
      failures.push(...sanityFailures);
    }

    if (bypassGate) {
      const hasFailures = failures.length > 0;
      return NextResponse.json({
        passed: true,
        reason: hasFailures
          ? `COHERENCE GATE PASSED (OVERRIDE): Approved by operator with warnings [${failures.join('; ')}].`
          : 'COHERENCE GATE PASSED: Approved by system operator.',
        riskScore,
        saturationWarning: saturationWarning || hasFailures,
        failures: hasFailures ? failures : undefined,
      } satisfies CoherenceGateResult & { failures?: string[] });
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