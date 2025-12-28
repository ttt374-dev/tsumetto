import { useState, useEffect } from 'react'

const phases = ["problem", "solution", "result"] as const;
export type PlayerPhase = (typeof phases)[number];

export function useKifPhase() {
  const initialPhaseIndex = 0;
  const [phaseIndex, setPhaseIndex] = useState(initialPhaseIndex);

  const currentPhase: PlayerPhase = phases[phaseIndex];

  function advancePhase() {
    setPhaseIndex(prev => Math.min(prev + 1, phases.length - 1));
  }

  function retreatPhase() {
    setPhaseIndex(prev => Math.max(prev - 1, 0));
  }

  function reset() {
    setPhaseIndex(initialPhaseIndex);
  }

  return {
    currentPhase,
    setCurrentPhase: (phase: PlayerPhase) => {
      const idx = phases.indexOf(phase);
      if (idx !== -1) setPhaseIndex(idx);
    },
    advancePhase,
    retreatPhase,
    reset,
  };
}