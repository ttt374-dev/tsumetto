//import type { useKifLibrary } from '../hooks/useKifLibrary'
//import type { useKifPlayer } from "../hooks/player/useKifPlayer";
import type { useKifLearning} from '../hooks/learning/useKifLearning'
import type { useKifNavigation } from '../hooks/useKifNavigation';
import type { useKifPlayerUI} from '../hooks/player/useKifPlayerUI'
import type { useKifEntryController} from '../hooks/useKifEntryController'
import type { useKifLibrarySort} from '../hooks/library/useKifLibrarySort'
import type { KifEntry } from './kifEntry'

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  //kifLibrary: ReturnType<typeof useKifLibrary>;
  //kifPlayer: ReturnType<typeof useKifPlayer>;
  kifLearning: ReturnType<typeof useKifLearning>
  kifNavigation: ReturnType<typeof useKifNavigation>
  //kifPlayerUI: ReturnType<typeof useKifPlayerUI>
  kifEntryController: ReturnType<typeof useKifEntryController>
  kifLibrarySort: ReturnType<typeof useKifLibrarySort>
  sortedEntries: KifEntry[]

};
