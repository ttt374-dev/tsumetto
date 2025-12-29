import { useState, useMemo } from "react";
import type { AnswerResult } from "../../types";

export function useQueueResult() {
  const [resultMap, setResultMap] = useState<Record<string, AnswerResult>>({});

  const summary = useMemo(() => {
    const values = Object.values(resultMap);
    const correct = values.filter(v => v === "correct").length;
    const wrong = values.filter(v => v === "wrong").length;
    const skipped = values.filter(v => v === "skipped").length;

    return {
      totalAnswered: values.length,
      correct,
      wrong,
      skipped,
      accuracy: values.length
        ? Math.round((correct / values.length) * 100)
        : 0,
    };
  }, [resultMap]);

  const setAnswer = (entryId: string, answer: AnswerResult) => {
    setResultMap(prev => ({
      ...prev,
      [entryId]: answer,
    }));
  };

  return {
    resultMap,
    setAnswer,
    summary,
  };
}
