import { useState, useEffect } from 'react'

const phases = ["problem", "solution", "result"] as const;
export type PlayerPhase = (typeof phases)[number];

export function useKifPhase(){
    const initialPhase = phases[0]
    const [phase, setPhase] = useState<PlayerPhase>(initialPhase)

    // currentEntryId が変わったら初期化
    useEffect(() => {
        reset()
    }, [])

    function advancePhase(){
        phases[Math.min(phase.indexOf(phase) + 1, phases.length - 1)];
    }
    function retreatPhase(){
        phases[Math.max(phases.indexOf(phase) - 1, 0)];
    }
    function reset(){
        setPhase(initialPhase)
    }
  return {
    currentPhase: phase,    
    setCurrentPhase: setPhase,    
    advancePhase, retreatPhase
  }
}