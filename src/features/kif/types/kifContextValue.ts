import type { useKifLibrary } from '../hooks/useKifLibrary'
import type { useKifPlayer } from "../hooks/useKifPlayer";
import type { useKifLearning} from '../hooks/useKifLearning'
import type { useKifNavigation } from '../hooks/useKifNavigation';
import type { useKifPlayerUI} from '../hooks/useKifPlayerUI'

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  kifLibrary: ReturnType<typeof useKifLibrary>;
  kifPlayer: ReturnType<typeof useKifPlayer>;
  kifLearning: ReturnType<typeof useKifLearning>
  kifNavigation: ReturnType<typeof useKifNavigation>
  kifPlayerUI: ReturnType<typeof useKifPlayerUI>

};
