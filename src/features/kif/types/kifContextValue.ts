import { useLearningRepository } from '../hooks/learning/useLearningRepository';
import type { KifEntry } from './kifEntry'
import type { Problem } from './problem';
import { useProblemRepository } from '../hooks/problem/useProblemRepository';

// hooks の返り値型を取得してまとめる
export type KifContextValue = {
  learningRepository: ReturnType<typeof useLearningRepository>
  problemRepository: ReturnType<typeof useProblemRepository>
  entries: KifEntry[]
  problems: Problem[]
  queue: string[]
  entryMap: Record<string, KifEntry>
  problemMap: Record<string, Problem>
};
