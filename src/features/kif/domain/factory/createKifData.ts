import type { KifData } from '../../types'
import { createEmptyBoard } from './createBoard';
import { createEmptyHand } from './createHand';

//////////////////
// 初期化関数

export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    board: createEmptyBoard(),
    hands: { black: createEmptyHand(), white: createEmptyHand() },
    //hands: { black: createEmptyHand(), white: createEmptyHand()},
    moves: [],
    title: "",
    //createdAt: Date.now(),
    ...partial,
  };
}
