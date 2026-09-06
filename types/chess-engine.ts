/**
 * DALEK CAAN CHESS ENGINE - TYPE DEFINITIONS
 * Siphoned from unitary-core, psr-governance, and darlek-cann-v3
 * Optimized by EMG Core v49 Neural Code and Documentation Optimizer Engine
 */

// ============================================================================
// CORE CHESS DOMAIN TYPES
// ============================================================================

/**
 * Zero-runtime cost enum for internal numeric piece representation.
 */
export const enum PieceTypeEnum {
  Pawn = 0,
  Rook = 1,
  Knight = 2,
  Bishop = 3,
  Queen = 4,
  King = 5,
}

/** Standard algebraic piece characters: p (pawn), r (rook), n (knight), b (bishop), q (queen), k (king). */
export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';

/** Piece and player color allegiance indicator. */
export type PieceColor = 'w' | 'b';

// Symbol marker utilized for nominal branding of algebraic chess squares.
declare const SquareBrand: unique symbol;

/**
 * Branded nominal type ensuring runtime string instances are verified algebraic squares (e.g., 'e4', 'a1').
 */
export type Square = string & { readonly [SquareBrand]: 'Square' };

// Constant coordinate vectors for standard chess board matrix initialization
const CHESS_FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;
const CHESS_RANKS = ['1', '2', '3', '4', '5', '6', '7', '8'] as const;

/** Pre-computed immutable lookup table containing all 64 valid algebraic squares. */
const VALID_SQUARES: ReadonlySet<string> = new Set<string>(
  CHESS_FILES.flatMap((file) => CHESS_RANKS.map((rank) => `${file}${rank}`))
);

/**
 * High-performance O(1) type-guard validating standard algebraic square notation.
 *
 * @param value - The input string coordinate to evaluate.
 * @returns Boolean type predicate narrowing value to `Square`.
 */
export function isValidSquare(value: string): value is Square {
  return VALID_SQUARES.has(value);
}

/**
 * Represents an individual piece instance on the board, including state modifications.
 */
export interface ChessPiece {
  readonly id: string;
  readonly type: PieceType;
  readonly color: PieceColor;
  readonly square: Square;
  readonly isResurrected?: boolean;
  readonly isRedeemed?: boolean;
}

/**
 * Immutable snapshot of the overall board configuration and game clock states.
 */
export interface BoardState {
  readonly pieces: Readonly<Record<string, ChessPiece>>;
  readonly turn: PieceColor;
  readonly halfMoveClock: number;
  readonly fullMoveNumber: number;
  readonly capturedPieces: {
    readonly w: readonly ChessPiece[];
    readonly b: readonly ChessPiece[];
  };
}

// ============================================================================
// HEURISTIC & EVALUATION TYPES
// ============================================================================

/**
 * Composite heuristic score breaking down engine state evaluation factors.
 */
export interface HeuristicEvaluation {
  readonly score: number;
  readonly materialScore: number;
  readonly positionalScore: number;
  readonly ethicalScore: number;
  readonly chaosNoise?: number;
}

// ============================================================================
// INTERVENTION & GOVERNANCE TYPES
// ============================================================================

/** Operations capable of mutating standard game laws. */
export type InterventionType =
  | 'VAPORIZE'
  | 'SPAWN_DRONE'
  | 'TELEPORT'
  | 'CELESTIAL_RESURRECTION'
  | 'SACRED_REDEMPTION';

/**
 * Audit record describing a rule-bending state mutation event.
 */
export interface InterventionEvent {
  readonly id: string;
  readonly type: InterventionType;
  readonly actor: 'DALEK' | 'JESUS';
  readonly timestamp: number;
  readonly details: {
    readonly targetSquare?: Square;
    readonly sourceSquare?: Square;
    readonly pieceId?: string;
    readonly pieceType?: PieceType;
  };
  readonly isChallenged: boolean;
  readonly isReverted: boolean;
}

/**
 * Real-time monitoring metrics for stability and alignment telemetry.
 */
export interface GovernanceMetrics {
  readonly securityStateEntropy: number;
  readonly antifragilityIndex: number;
  readonly ethicalAlignmentVector: {
    readonly harmony: number;
    readonly destruction: number;
  };
}

// ============================================================================
// ENGINE CONFIGURATION & UTILITY TYPES
// ============================================================================

/**
 * Configuration parameters for engine decision engines and non-deterministic behavior multipliers.
 */
export interface EngineConfig {
  readonly dalekChaosCoefficient: number;
  readonly jesusCommunityMultiplier: number;
  readonly cheatProbability: number;
  readonly miracleProbability: number;
  readonly useLLMFallback: boolean;
}

/**
 * Lifecycle handler interface for subscription cleanup patterns.
 */
export interface SubscriptionTeardown {
  readonly unsubscribe: () => void;
}