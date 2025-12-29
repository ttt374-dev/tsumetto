import { useLearningRepository } from '../hooks/learning/useLearningRepository';
import type { KifEntry } from './kifEntry'
import { useProblemRepository } from '../hooks/problem/useProblemRepository';

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  learningRepository: ReturnType<typeof useLearningRepository>
  problemRepository: ReturnType<typeof useProblemRepository>
  entries: KifEntry[]
  queue: string[]
  entryMap: Record<string, KifEntry>
};
