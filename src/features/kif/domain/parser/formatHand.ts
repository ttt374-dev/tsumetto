import type { Hand, HandPieceKey } from '../../types'
import { NumberToKanji } from './kanToNumber';

export function formatHand(hand: Hand): string {
  console.log("format hand", hand)
  const parts: string[] = [];

  (Object.keys(hand) as HandPieceKey[]).forEach((piece) => {
    const count = hand[piece];
    if (count > 0) {
      const suffix = NumberToKanji[count] ?? count.toString();
      parts.push(`${piece}${suffix}`);
    }
  });
  
  return parts.length === 0 ? "なし" : parts.join(" ");
}
