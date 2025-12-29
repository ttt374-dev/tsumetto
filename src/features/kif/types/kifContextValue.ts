import type { useLearning} from '../hooks/learning/useLearningRepository'
import type { KifEntry } from './kifEntry'
import { useProblemRepository } from '../hooks/problem/useProblemRepository';

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  kifLearning: ReturnType<typeof useLearning>
  problemRepository: ReturnType<typeof useProblemRepository>
  entries: KifEntry[]
  queue: string[]
  entryMap: Record<string, KifEntry>
};
