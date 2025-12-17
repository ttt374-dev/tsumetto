import type { useKifLibrary } from '../hooks/useKifLibrary'
import type { useKifPlayer } from "../hooks/useKifPlayer";

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  kifLibrary: ReturnType<typeof useKifLibrary>;
  kifPlayer: ReturnType<typeof useKifPlayer>;
};
