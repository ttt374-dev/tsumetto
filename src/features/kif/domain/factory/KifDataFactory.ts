import type { KifData } from '../../types'
import { createEmptyBoard } from './KifBoardFactroy';
import { createEmptyHand } from './KifHandFactory';

//////////////////
// 初期化関数

export function createKifData(
  partial?: Partial<KifData>
): KifData {
  return {
    board: createEmptyBoard(),
    hands: { black: createEmptyHand(), white: createEmptyHand() },
    events: [],
    headers: {},
    ...partial,
  };
}
