import { type HandPieceKey, PieceTypes  } from "../types";

export function createEmptyHand(): Record<HandPieceKey, number> {
  const hand = {} as Record<HandPieceKey, number>;

  for (const [key, def] of Object.entries(PieceTypes)) {
    if (!def.promoted) {
      hand[key as HandPieceKey] = 0;
    }
  }

  return hand;
}

