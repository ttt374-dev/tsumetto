import { useState, useEffect } from 'react'

// フェーズ定義
export type ProblemPhase =
  | "problem"   // 盤面のみ表示（解答前）
  | "solution"  // 解答手順表示
  | "result"    // 正誤結果表示

// 正答・誤答
export type ProblemResult = "solved" | "failed" | null

// フックで管理する状態
export type ProblemProgressState = {
  phase: ProblemPhase
  selectedResult: ProblemResult
}

// フック本体
export function useProblemProgress(currentEntryId: string | null) {

  const [state, setState] = useState<ProblemProgressState>({
    phase: "problem",
    selectedResult: null,
  })

  // currentEntryId が変わったら初期化
  useEffect(() => {
    setState(prev => ({ ...prev, phase: "problem", selectedResult: null }))
  }, [currentEntryId])

  // フェーズを変更
  function setPhase(phase: ProblemPhase){
    setState(prev => ({ ...prev, phase }))
  }

  // 正答・誤答を選択
  function chooseResult(result: ProblemResult){
    setState(prev => ({ ...prev, phase: "result", selectedResult: result }))
  }  

  return {
    currentPhase: state.phase,
    selectedResult: state.selectedResult,
    setPhase,
    chooseResult,    
  }
}
