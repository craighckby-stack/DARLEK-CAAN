import { Chess, Square } from 'chess.js';

// Piece-square tables for tactical depth evaluation
// Standard chess evaluation values (from White's perspective, flipped for Black)
const pawnEval: number[][] = [
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
  [1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
  [0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
  [0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
  [0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
  [0.5,  1.0,  1.0, -2.0, -2.0,  1.0,  1.0,  0.5],
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
];

const knightEval: number[][] = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
  [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
  [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
  [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
  [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
  [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
];

const bishopEval: number[][] = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
];

const rookEval: number[][] = [
  [0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [0.0,   0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
];

const queenEval: number[][] = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [0.0,   0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.0,  0.0,  0.5,  0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
];

const kingEval: number[][] = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
  [2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
];

/**
 * Validates that a FEN string is properly formatted and safe to ingest.
 */
export function isSafeFen(fen: string): boolean {
  if (!fen || typeof fen !== 'string' || fen.length > 128) return false;
  // Basic structural check for FEN space separation (6 fields)
  const parts = fen.trim().split(/\s+/);
  if (parts.length !== 6) return false;
  try {
    const temp = new Chess(fen);
    return typeof temp === 'object' && temp !== null;
  } catch {
    return false;
  }
}

// Helper to evaluate static board value for Dalek Caan
function evaluateBoardForCaan(chess: Chess, chaosFactor?: number): number {
  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let value = 0;
      switch (piece.type) {
        case 'p':
          value = 10 + (piece.color === 'w' ? pawnEval[r][c] : pawnEval[7 - r][c]);
          break;
        case 'n':
          value = 30 + (piece.color === 'w' ? knightEval[r][c] : knightEval[7 - r][c]);
          break;
        case 'b':
          value = 30 + (piece.color === 'w' ? bishopEval[r][c] : bishopEval[7 - r][c]);
          break;
        case 'r':
          value = 56 + (piece.color === 'w' ? rookEval[r][c] : rookEval[7 - r][c]);
          break;
        case 'q':
          value = 105 + (piece.color === 'w' ? queenEval[r][c] : queenEval[7 - r][c]);
          break;
        case 'k':
          value = 950 + (piece.color === 'w' ? kingEval[r][c] : kingEval[7 - r][c]);
          break;
      }

      if (piece.color === 'w') {
        score += value;
      } else {
        score -= value * 1.08;
      }
    }
  }

  if (chess.inCheck() && chess.turn() === 'w') {
    score += 25; 
  }

  const multiplier = (typeof chaosFactor === 'number' && Number.isFinite(chaosFactor)) ? chaosFactor : 1;
  const range = Math.max(1, Math.round(4 * multiplier));
  const noise = Math.floor(Math.random() * (range * 2 + 1)) - range; 
  return score + noise;
}

// Helper to evaluate static board value for Jesus
function evaluateBoardForJesus(chess: Chess): number {
  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;

      let value = 0;
      switch (piece.type) {
        case 'p':
          value = 13 + (piece.color === 'w' ? pawnEval[r][c] : pawnEval[7 - r][c]);
          break;
        case 'n':
          value = 28 + (piece.color === 'w' ? knightEval[r][c] : knightEval[7 - r][c]);
          break;
        case 'b':
          value = 32 + (piece.color === 'w' ? bishopEval[r][c] : bishopEval[7 - r][c]);
          break;
        case 'r':
          value = 48 + (piece.color === 'w' ? rookEval[r][c] : rookEval[7 - r][c]);
          break;
        case 'q':
          value = 85 + (piece.color === 'w' ? queenEval[r][c] : queenEval[7 - r][c]);
          break;
        case 'k':
          value = 1000 + (piece.color === 'w' ? kingEval[r][c] : kingEval[7 - r][c]);
          break;
      }

      let communityBonus = 0;
      if (piece.color === 'w') {
        const adjacentCols = [c - 1, c + 1].filter((col: number): boolean => col >= 0 && col < 8);
        for (const col of adjacentCols) {
          const adjPiece = board[r][col];
          if (adjPiece && adjPiece.color === 'w' && adjPiece.type === 'p') {
            communityBonus += 1.5;
          }
        }
      }

      const totalVal = value + communityBonus;

      if (piece.color === 'w') {
        score += totalVal;
      } else {
        score -= totalVal;
      }
    }
  }

  const noise = (Math.random() < 0.5) ? 0 : 1; 
  return score + noise;
}

// Minimax with Alpha-Beta Pruning
function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizingPlayer: boolean,
  brain: 'CAAN' | 'JESUS',
  chaosFactor?: number
): { score: number; move: string | null } {
  if (depth <= 0 || chess.isGameOver()) {
    const score = brain === 'CAAN' ? evaluateBoardForCaan(chess, chaosFactor) : evaluateBoardForJesus(chess);
    return { score, move: null };
  }

  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) {
    if (chess.inCheck()) {
      return { score: isMaximizingPlayer ? -Infinity : Infinity, move: null };
    }
    return { score: 0, move: null };
  }

  for (let i = moves.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = moves[i];
    moves[i] = moves[j];
    moves[j] = temp;
  }

  moves.sort((a, b) => {
    const aVal = a.captured ? 10 : 0;
    const bVal = b.captured ? 10 : 0;
    return bVal - aVal;
  });

  let bestMove: string | null = null;

  if (isMaximizingPlayer) {
    let maxScore = -Infinity;
    for (const move of moves) {
      chess.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      const result = minimax(chess, depth - 1, alpha, beta, false, brain, chaosFactor);
      chess.undo();

      if (result.score > maxScore) {
        maxScore = result.score;
        bestMove = move.lan;
      }
      alpha = Math.max(alpha, result.score);
      if (beta <= alpha) {
        break;
      }
    }
    return { score: maxScore, move: bestMove };
  } else {
    let minScore = Infinity;
    for (const move of moves) {
      chess.move({ from: move.from, to: move.to, promotion: move.promotion || 'q' });
      const result = minimax(chess, depth - 1, alpha, beta, true, brain, chaosFactor);
      chess.undo();

      if (result.score < minScore) {
        minScore = result.score;
        bestMove = move.lan;
      }
      beta = Math.min(beta, result.score);
      if (beta <= alpha) {
        break;
      }
    }
    return { score: minScore, move: bestMove };
  }
}

/**
 * Computes the best move for the specified player color with defensive validation bounds.
 */
export function getBestMove(
  fen: string,
  color: 'w' | 'b',
  difficulty: 'EASY' | 'MEDIUM' | 'HARD',
  chaosFactor?: number
): string | null {
  if (!isSafeFen(fen)) {
    return null;
  }

  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return null;
  }

  const moves = chess.moves({ verbose: true });
  if (moves.length === 0) return null;

  const brain = color === 'b' ? 'CAAN' : 'JESUS';

  if (difficulty === 'EASY') {
    if (Math.random() < 0.25) {
      const idx = Math.floor(Math.random() * moves.length);
      return moves[idx]?.lan ?? null;
    }
    const result = minimax(chess, 1, -Infinity, Infinity, color === 'w', brain, chaosFactor);
    return result.move ?? moves[0]?.lan ?? null;
  }

  if (difficulty === 'MEDIUM') {
    const result = minimax(chess, 2, -Infinity, Infinity, color === 'w', brain, chaosFactor);
    return result.move ?? moves[0]?.lan ?? null;
  }

  if (difficulty === 'HARD') {
    const result = minimax(chess, 3, -Infinity, Infinity, color === 'w', brain, chaosFactor);
    return result.move ?? moves[0]?.lan ?? null;
  }

  return moves[0]?.lan ?? null;
}