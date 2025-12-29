import type { useKifLearning} from '../hooks/learning/useKifLearning'
import type { KifEntry } from './kifEntry'
import { useProblemRepository } from '../hooks/problem/useProblemRepository';

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  kifLearning: ReturnType<typeof useKifLearning>
  problemRepository: ReturnType<typeof useProblemRepository>
  entries: KifEntry[]
  queue: string[]
  entryMap: Record<string, KifEntry>
};
