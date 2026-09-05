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

const DECIMAL_PRECISION_STANDARD = 2;
const DECIMAL_PRECISION_HIGH = 3;

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
 * Aggregates statistics across all provided mutation payloads.
 */
function aggregateMutations(mutations: readonly MutationInput[] = []): AggregateMutationStats {
  return mutations.reduce<AggregateMutationStats>(
    (acc, mutation) => {
      const isPending = mutation.status === 'pending';
      const isApplied = mutation.status === 'applied';
      const isRejected = mutation.status === 'rejected';

      const fileCount = Array.isArray(mutation.affectedFiles) ? mutation.affectedFiles.length : 0;

      return {
        pendingMutations: acc.pendingMutations + (isPending ? 1 : 0),
        appliedMutations: acc.appliedMutations + (isApplied ? 1 : 0),
        rejectedMutations: acc.rejectedMutations + (isRejected ? 1 : 0),
        totalAffectedFiles: acc.totalAffectedFiles + fileCount,
      };
    },
    { pendingMutations: 0, appliedMutations: 0, rejectedMutations: 0, totalAffectedFiles: 0 }
  );
}

/**
 * Computes saturation metrics based on aggregate mutation statistics.
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
    structuralChange: Number(structuralChange.toFixed(DECIMAL_PRECISION_STANDARD)),
    semanticSaturation: Number(semanticSaturation.toFixed(DECIMAL_PRECISION_HIGH)),
    velocity: Number(velocity.toFixed(DECIMAL_PRECISION_STANDARD)),
    identityPreservation: Number(identityPreservation.toFixed(DECIMAL_PRECISION_STANDARD)),
    capabilityAlignment: Number(capabilityAlignment.toFixed(DECIMAL_PRECISION_STANDARD)),
    crossFileImpact: Number(crossFileImpact.toFixed(DECIMAL_PRECISION_STANDARD)),
  };
}

/**
 * Evaluates individual metric thresholds to tally warning and critical alerts.
 */
function evaluateThresholds(metrics: SaturationMetrics): ThresholdCounts {
  let warningCount = 0;
  let criticalCount = 0;

  // Structural Change
  if (metrics.structuralChange > 4) criticalCount++;
  else if (metrics.structuralChange > 3) warningCount++;

  // Semantic Saturation
  if (metrics.semanticSaturation > 0.28) criticalCount++;
  else if (metrics.semanticSaturation > 0.21) warningCount++;

  // Velocity
  if (metrics.velocity > 4) criticalCount++;
  else if (metrics.velocity > 3) warningCount++;

  // Identity Preservation
  if (metrics.identityPreservation < 0.2) criticalCount++;
  else if (metrics.identityPreservation < 0.4) warningCount++;

  // Capability Alignment
  if (metrics.capabilityAlignment > 4) criticalCount++;
  else if (metrics.capabilityAlignment > 3) warningCount++;

  // Cross File Impact
  if (metrics.crossFileImpact > 2.4) criticalCount++;
  else if (metrics.crossFileImpact > 1.8) warningCount++;

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

  const result: HealthCheckResult = {
    metrics,
    overallHealth,
  };

  return NextResponse.json(result);
}