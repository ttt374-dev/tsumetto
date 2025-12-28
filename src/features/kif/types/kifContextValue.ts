import type { useKifLearning} from '../hooks/learning/useKifLearning'
import type { useKifNavigation } from '../hooks/useKifNavigation';
import type { useKifEntryController} from '../hooks/useKifEntryController'
import type { useKifLibrarySort} from '../hooks/library/useKifLibrarySort'
import type { KifEntry } from './kifEntry'

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  kifLearning: ReturnType<typeof useKifLearning>
  kifNavigation: ReturnType<typeof useKifNavigation>
  kifEntryController: ReturnType<typeof useKifEntryController>
  kifLibrarySort: ReturnType<typeof useKifLibrarySort>
  sortedEntries: KifEntry[]
  queue: string[]
  entryMap: Record<string, KifEntry>
};
