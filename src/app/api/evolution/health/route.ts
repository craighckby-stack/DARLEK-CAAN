/**
 * DARLEK CANN ARCHITECTURAL HEADER
 * File: src/app/api/evolution/health/route.ts
 * Role: Core system component participating in autonomous cognitive evolution cycles.
 * Architecture: Type-safe modular unit with resilient state interfaces.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { HealthCheckResult, SaturationMetrics } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type MutationStatus = 'pending' | 'applied' | 'rejected' | (string & {});

interface MutationInput {
  readonly status?: MutationStatus;
  readonly affectedFiles?: readonly unknown[];
}

interface RequestBody {
  readonly mutations?: readonly MutationInput[];
}

interface ErrorResponse {
  readonly metrics: null;
  readonly overallHealth: 'critical';
  readonly error: string;
}

interface AggregateMutationStats {
  readonly pendingMutations: number;
  readonly appliedMutations: number;
  readonly rejectedMutations: number;
  readonly totalAffectedFiles: number;
}

interface ThresholdCounts {
  readonly warningCount: number;
  readonly criticalCount: number;
}

/**
 * Safely parses the incoming HTTP request body, returning an empty request object on failure.
 */
async function parseRequestBody(req: NextRequest): Promise<RequestBody | ErrorResponse> {
  try {
    const rawText = await req.text();
    if (!rawText) {
      return {};
    }
    return JSON.parse(rawText) as RequestBody;
  } catch {
    return {
      metrics: null,
      overallHealth: 'critical',
      error: 'Invalid JSON payload format.',
    };
  }
}

/**
 * Aggregates statistics across all provided mutation payloads using an optimized unrolled imperative loop.
 */
function aggregateMutations(mutations: readonly MutationInput[] = []): AggregateMutationStats {
  let pendingMutations = 0;
  let appliedMutations = 0;
  let rejectedMutations = 0;
  let totalAffectedFiles = 0;

  const len = mutations.length;
  let i = 0;

  // Unroll loop for high-frequency execution performance
  while (i + 3 < len) {
    const m0 = mutations[i];
    const m1 = mutations[i + 1];
    const m2 = mutations[i + 2];
    const m3 = mutations[i + 3];

    if (m0?.status === 'pending') pendingMutations++;
    else if (m0?.status === 'applied') appliedMutations++;
    else if (m0?.status === 'rejected') rejectedMutations++;
    if (Array.isArray(m0?.affectedFiles)) totalAffectedFiles += m0.affectedFiles.length;

    if (m1?.status === 'pending') pendingMutations++;
    else if (m1?.status === 'applied') appliedMutations++;
    else if (m1?.status === 'rejected') rejectedMutations++;
    if (Array.isArray(m1?.affectedFiles)) totalAffectedFiles += m1.affectedFiles.length;

    if (m2?.status === 'pending') pendingMutations++;
    else if (m2?.status === 'applied') appliedMutations++;
    else if (m2?.status === 'rejected') rejectedMutations++;
    if (Array.isArray(m2?.affectedFiles)) totalAffectedFiles += m2.affectedFiles.length;

    if (m3?.status === 'pending') pendingMutations++;
    else if (m3?.status === 'applied') appliedMutations++;
    else if (m3?.status === 'rejected') rejectedMutations++;
    if (Array.isArray(m3?.affectedFiles)) totalAffectedFiles += m3.affectedFiles.length;

    i += 4;
  }

  while (i < len) {
    const mutation = mutations[i];
    const status = mutation?.status;

    if (status === 'pending') {
      pendingMutations++;
    } else if (status === 'applied') {
      appliedMutations++;
    } else if (status === 'rejected') {
      rejectedMutations++;
    }

    const affectedFiles = mutation?.affectedFiles;
    if (Array.isArray(affectedFiles)) {
      totalAffectedFiles += affectedFiles.length;
    }
    i++;
  }

  return {
    pendingMutations,
    appliedMutations,
    rejectedMutations,
    totalAffectedFiles,
  };
}

/**
 * Computes saturation metrics based on aggregate mutation statistics with zero intermediate object allocations.
 */
function calculateMetrics(stats: AggregateMutationStats, totalMutationsCount: number): SaturationMetrics {
  const { appliedMutations, pendingMutations, rejectedMutations, totalAffectedFiles } = stats;

  const structuralChange = Math.min(5, 0.5 + appliedMutations * 0.4);
  const semanticSaturation = Math.min(1.0, 0.05 + totalMutationsCount * 0.02 + pendingMutations * 0.05);
  const velocity = Math.min(5, 1.0 + appliedMutations * 0.3 + rejectedMutations * 0.1);
  const identityPreservation = Math.max(0.1, 1.0 - appliedMutations * 0.05);
  const capabilityAlignment = Math.min(5, 1.5 + appliedMutations * 0.5);
  const crossFileImpact = Math.min(5, 0.3 + totalAffectedFiles * 0.2);

  return {
    structuralChange: Math.round(structuralChange * 100) / 100,
    semanticSaturation: Math.round(semanticSaturation * 1000) / 1000,
    velocity: Math.round(velocity * 100) / 100,
    identityPreservation: Math.round(identityPreservation * 100) / 100,
    capabilityAlignment: Math.round(capabilityAlignment * 100) / 100,
    crossFileImpact: Math.round(crossFileImpact * 100) / 100,
  };
}

/**
 * Evaluates individual metric thresholds to tally warning and critical alerts using fast branch checks.
 */
function evaluateThresholds(metrics: SaturationMetrics): ThresholdCounts {
  let warningCount = 0;
  let criticalCount = 0;

  // Structural Change
  const sc = metrics.structuralChange;
  if (sc > 4) {
    criticalCount++;
  } else if (sc > 3) {
    warningCount++;
  }

  // Semantic Saturation
  const ss = metrics.semanticSaturation;
  if (ss > 0.28) {
    criticalCount++;
  } else if (ss > 0.21) {
    warningCount++;
  }

  // Velocity
  const vel = metrics.velocity;
  if (vel > 4) {
    criticalCount++;
  } else if (vel > 3) {
    warningCount++;
  }

  // Identity Preservation
  const ip = metrics.identityPreservation;
  if (ip < 0.2) {
    criticalCount++;
  } else if (ip < 0.4) {
    warningCount++;
  }

  // Capability Alignment
  const ca = metrics.capabilityAlignment;
  if (ca > 4) {
    criticalCount++;
  } else if (ca > 3) {
    warningCount++;
  }

  // Cross File Impact
  const cfi = metrics.crossFileImpact;
  if (cfi > 2.4) {
    criticalCount++;
  } else if (cfi > 1.8) {
    warningCount++;
  }

  return { warningCount, criticalCount };
}

/**
 * Determines overall health state from warning and critical counts.
 */
function deriveOverallHealth(counts: ThresholdCounts): 'healthy' | 'warning' | 'critical' {
  const { warningCount, criticalCount } = counts;

  if (criticalCount >= 2) {
    return 'critical';
  }
  if (warningCount >= 2 || criticalCount >= 1) {
    return 'warning';
  }
  return 'healthy';
}

export async function POST(req: NextRequest): Promise<NextResponse<HealthCheckResult | ErrorResponse>> {
  const parsedBody = await parseRequestBody(req);

  if ('error' in parsedBody) {
    return NextResponse.json(parsedBody, { status: 400 });
  }

  const mutations = Array.isArray(parsedBody?.mutations) ? parsedBody.mutations : [];
  const mutationStats = aggregateMutations(mutations);
  const metrics = calculateMetrics(mutationStats, mutations.length);
  const thresholds = evaluateThresholds(metrics);
  const overallHealth = deriveOverallHealth(thresholds);

  return NextResponse.json({
    metrics,
    overallHealth,
  });
}