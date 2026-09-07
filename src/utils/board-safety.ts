import { Chess, PieceSymbol, Square } from 'chess.js';

/**
 * Constant representing the piece type symbol for a chess king.
 */
const KING_PIECE_TYPE: PieceSymbol = 'k';

/**
 * Determines whether the specified square on the chess board is currently occupied by a king.
 *
 * @param board - The chess board instance to inspect.
 * @param square - The board square to evaluate.
 * @returns `true` if a king occupies the square; otherwise, `false`.
 */
const isKingAtSquare = (board: Chess, square: Square): boolean => {
  try {
    const currentPiece = board.get(square);
    return currentPiece?.type === KING_PIECE_TYPE;
  } catch {
    return false;
  }
};

/**
 * Safely removes a piece from the board, preventing the removal of kings.
 *
 * @param board - The active chess board instance.
 * @param square - The target board square to clear.
 * @returns `true` if the piece was successfully removed; `false` if the square contains a king or operation fails.
 */
export const safeRemove = (board: Chess, square: Square): boolean => {
  try {
    if (isKingAtSquare(board, square)) {
      return false;
    }

    const removed = board.remove(square);
    return removed !== null;
  } catch {
    return false;
  }
};

/**
 * Safely places a piece onto the board, preventing existing kings from being overwritten.
 *
 * @param board - The active chess board instance.
 * @param piece - The piece representation containing color and type.
 * @param square - The destination square on the board.
 * @returns `true` if the piece was successfully placed; `false` if target square contains a king or operation fails.
 */
export const safePut = (
  board: Chess,
  piece: Parameters<Chess['put']>[0],
  square: Square
): boolean => {
  try {
    if (isKingAtSquare(board, square)) {
      return false;
    }

    return board.put(piece, square);
  } catch {
    return false;
  }
};