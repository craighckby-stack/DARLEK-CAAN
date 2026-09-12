import { Chess, PieceSymbol, Square } from 'chess.js';

const KING_SYMBOL: PieceSymbol = 'k';

/**
 * Checks whether a given square contains a king piece.
 */
function isKingSquare(board: Chess, square: Square): boolean {
  try {
    const piece = board.get(square);
    return piece?.type === KING_SYMBOL;
  } catch {
    return false;
  }
}

/**
 * Safely removes a piece from the board while preventing king removal.
 */
export const safeRemove = (board: Chess, square: Square): boolean => {
  try {
    if (isKingSquare(board, square)) {
      return false;
    }
    return board.remove(square) !== null;
  } catch {
    return false;
  }
};

/**
 * Safely places a piece onto the board while preventing king replacement.
 */
export const safePut = (
  board: Chess,
  piece: Parameters<Chess['put']>[0],
  square: Square
): boolean => {
  try {
    if (isKingSquare(board, square)) {
      return false;
    }
    return board.put(piece, square);
  } catch {
    return false;
  }
};