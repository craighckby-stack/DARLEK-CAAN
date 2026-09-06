/**
 * DALEK CAAN CHESS ENGINE - TYPE DEFINITIONS
 * Siphoned from unitary-core, psr-governance, and darlek-cann-v3
 * Optimized by EMG Core v49 Neural Code and Documentation Optimizer Engine
 */

export const enum PieceTypeEnum {
  Pawn = 0,
  Rook = 1,
  Knight = 2,
  Bishop = 3,
  Queen = 4,
  King = 5,
}

export type PieceType = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type PieceColor = 'w' | 'b';

// Brand type utilizing unique symbol for absolute structural nominal typing safety
declare const SquareBrand: unique symbol;
export type Square = string & { readonly [SquareBrand]: 'Square' };

// Pre-allocated lookup cache for validation speedup (O(1) lookup instead of RegExp execution)
const VALID_SQUARES: ReadonlySet<string> = (() => {
  const set = new Set<string>();
  const files = 'abcdefgh';
  const ranks = '12345678';
  for (let f = 0; f < 8; f++) {
    for (let r = 0; r < 8; r++) {
      set.add(files[f] + ranks[r]);
    }
  }
  return set;
})();

/**
 * High-performance O(1) type guard replacing RegExp execution overhead with direct set lookups.
 */
export function isValidSquare(value: string): value is Square {
  return VALID_SQUARES.has(value);
}

export interface ChessPiece {
  readonly id: string;
  readonly type: PieceType;
  readonly color: PieceColor;
  readonly square: Square;
  readonly isResurrected?: boolean;
  readonly isRedeemed?: boolean;
}

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

export interface HeuristicEvaluation {
  readonly score: number;
  readonly materialScore: number;
  readonly positionalScore: number;
  readonly ethicalScore: number;
  readonly chaosNoise?: number;
}

export type InterventionType = 
  | 'VAPORIZE' 
  | 'SPAWN_DRONE' 
  | 'TELEPORT' 
  | 'CELESTIAL_RESURRECTION' 
  | 'SACRED_REDEMPTION';

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

export interface GovernanceMetrics {
  readonly securityStateEntropy: number;
  readonly antifragilityIndex: number;
  readonly ethicalAlignmentVector: {
    readonly harmony: number;
    readonly destruction: number;
  };
}

export interface EngineConfig {
  readonly dalekChaosCoefficient: number;
  readonly jesusCommunityMultiplier: number;
  readonly cheatProbability: number;
  readonly miracleProbability: number;
  readonly useLLMFallback: boolean;
}

export interface SubscriptionTeardown {
  readonly unsubscribe: () => void;
}