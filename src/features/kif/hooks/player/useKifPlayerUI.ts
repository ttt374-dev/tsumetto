import { useEffect, useState } from "react";

export function useKifPlayerUI(currentEntryId: string | null) {
  const [isMovesVisible, setIsMovesVisible] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false)

  useEffect(() => {
      hideMoves()
  }, [currentEntryId])

    function showMoves(){
      setIsMovesVisible(true)
    }
    function hideMoves(){
      setIsMovesVisible(false)
    }
  function toggleMovesVisible() {
    
    setIsMovesVisible(v => !v);
  }

  return {
    showMoves,
    hideMoves,
    isMovesVisible,
    toggleMovesVisible,

    openEditDialog,
    setOpenEditDialog,
  };
}
