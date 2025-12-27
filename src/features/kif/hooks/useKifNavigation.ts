import { useState,  useEffect, useMemo } from "react";
import type { KifEntry } from "../types";

export function useKifNavigation(sortedEntries: KifEntry[]) {
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  // 起動時に先頭のを用いる
  useEffect(() => {
        if (sortedEntries.length > 0 && !currentEntryId) {
            setCurrentEntryId(sortedEntries[0].id);
        }
    }, [sortedEntries, currentEntryId]);
        const currentEntry = useMemo(() => {
        if (currentEntryId === null) return null
        else return sortedEntries.find(e => e.id === currentEntryId) ?? null
    }, [currentEntryId, sortedEntries ])

    function getIndex(entryId: string): number {
        return sortedEntries.findIndex(e => e.id === currentEntryId)        
    }

  // ナビゲーター
      const navigateTo = (dest: string) => {
          if (!currentEntryId) return;
          //const currentIndex = sortedEntries.findIndex(e => e.id === currentEntryId)        
          const currentIndex = getIndex(currentEntryId)
          console.log("current index", currentIndex)
  
          switch(dest){
              case 'first':
                  const first = sortedEntries[0]
                  setCurrentEntryId(first.id)
                  break;
              case 'prev':
                  if (currentIndex <= 0) return
                  const prev = sortedEntries[currentIndex - 1]        
                  if (!prev) return
                  console.log("navigate to prev", prev.id)
                  setCurrentEntryId(prev.id)
                  break;
              case 'next':
                  if (currentIndex < 0) return
                  const next = sortedEntries[currentIndex + 1]        
                  if (!next) return
                  setCurrentEntryId(next.id)
                  console.log("navigate to next", next.id)
                  break;
              case 'last':
                  const last = sortedEntries[sortedEntries.length-1]
                  setCurrentEntryId(last.id)
                  break;
              default:
                  break;
          }
      }
      function nextEntryAvailable(entryId: string): boolean {
        const index = getIndex(entryId)
        if (index === -1) return false
        return index < sortedEntries.length - 1
      }
      function isFirstEntry(entryId: string): boolean {
          if (sortedEntries.length === 0) return false;
          return sortedEntries[0].id === entryId;
      }

      return {
        currentEntryId,
        currentEntry,
        setCurrentEntryId,
        navigateTo,
        nextEntryAvailable,
        isFirstEntry,
      }


}
