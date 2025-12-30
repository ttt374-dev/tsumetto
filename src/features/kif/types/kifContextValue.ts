import { useLearningRepository } from '../hooks/learning/useLearningRepository';
import type { KifEntry } from './kifEntry'
import type { Problem } from './problem';
import { useProblemRepository } from '../hooks/problem/useProblemRepository';
import { usePlayerSession } from '../hooks/session/usePlayerSession';
import type { useKifLibrarySort } from '../hooks/library/useKifLibrarySort';
import type { useKifDeckFilter } from '../hooks/deck/useKifDeckFilter';

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  learningRepository: ReturnType<typeof useLearningRepository>
  problemRepository: ReturnType<typeof useProblemRepository>
  playerSessionApi: ReturnType<typeof usePlayerSession>
  entries: KifEntry[]
  problems: Problem[]
  queue: string[]
  entryMap: Record<string, KifEntry>
  problemMap: Record<string, Problem> 

  sort: ReturnType<typeof useKifLibrarySort>
  filter: ReturnType<typeof useKifDeckFilter>

};
