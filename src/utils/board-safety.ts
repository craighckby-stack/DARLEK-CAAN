import { Chess, Square } from 'chess.js';

export const safeRemove = (board: Chess, square: Square): boolean => {
  if (board.get(square)?.type === 'k') return false;
  board.remove(square);
  return true;
};

export const safePut = (board: Chess, piece: { type: string; color: string }, square: Square): boolean => {
  if (board.get(square)?.type === 'k') return false;
  board.put(piece as any, square);
  return true;
};