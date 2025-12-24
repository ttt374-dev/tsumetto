import { useEffect, useState } from "react";
import { useSwipeable } from "react-swipeable";

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
    //setIsMovesVisible,
    toggleMovesVisible,

    openEditDialog,
    setOpenEditDialog,
  };
}
