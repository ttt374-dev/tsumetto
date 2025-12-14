import { useState } from 'react'
import { parseKif } from "../kifParser";
import { type KifPlaybackState } from "../types";

export function useKifPlayer() {
  const [kifPlaybackState, setKifPlaybackState] =
    useState<KifPlaybackState>({
      source: "temp",
      playMode: "single",
    });

  const loadFromText = (text: string, title?: string) => {
    const kif = parseKif(text);
    setKifPlaybackState({
      source: "temp",
      playMode: "single",
      kif,
      title,
    });
  };

  return { kifPlaybackState, loadFromText };
}
