import { useEffect, useState } from "react"
import type { Problem } from "../../types/problem"
import { useProblemPersist } from "./useProblemPersist"

export function useProblemRepository() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const persistApi = useProblemPersist();

  useEffect(() => {
    persistApi
      .load()
      .then(setProblems)
      .catch(() => setProblems([]));
  }, []);

  const findById = (id: string): Problem | null => {
    return problems.find(problem => problem.id === id) ?? null
  }
  const persist = async (next: Problem[]): Promise<void> => {
    await persistApi.save(next);
    setProblems(next);
  };

  const add = async (problem: Problem): Promise<void> => {
    await persist([...problems, problem]);
  };

  const remove = async (id: string): Promise<void> => {
    const next = problems.filter((e) => e.id !== id);
    await persist(next);
  };
  const removeMany = async(ids: string[]): Promise<void> => {
    if (ids.length === 0) return;
    const idSet = new Set(ids); // 高速判定
    const next = problems.filter((p) => !idSet.has(p.id));
    console.log("remove many: ", next)
    await persist(next);
  }
  const update = async (updatedProblem: Problem): Promise<void> => {
    const next = problems.map((p) =>
      p.id === updatedProblem.id ? updatedProblem : p
    );
    await persist(next);
  };

  return { findById, add, remove, removeMany, update, problems };
}
