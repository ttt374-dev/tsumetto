import { useState } from "react";

export function useKifNavigation() {
  const [currentEntryId, setCurrentEntryId] = useState<string | null>(null);

  function playByEntryId(entryId: string | null) {
    setCurrentEntryId(entryId);
  }

  return {
    currentEntryId,
    playByEntryId
  };
}
