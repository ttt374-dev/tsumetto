import { useContext } from 'react'
import { type KifContextValue } from "../types/kifContextValue";
import { KifContext } from '../../../app/providers/KifProvider'

// Hook で安全に取得
export function useKif(): KifContextValue {
  const ctx = useContext(KifContext);
  if (!ctx) throw new Error("useKif must be used within a KifProvider");
  return ctx;
}




