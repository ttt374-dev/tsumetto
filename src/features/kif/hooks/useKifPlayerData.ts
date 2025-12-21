import type { KifData, Board, Hand, Move } from '../types/'

export type KifPlayerDataState = {
  kifData: KifData | null;

  /*
  initialBoard: Board | null;
  initialHands: Hand | null;
  moves: Move[];
*/
  title: string;
  source?: string;
};
