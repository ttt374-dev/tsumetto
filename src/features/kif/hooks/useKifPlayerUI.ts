import { useState } from "react";

export function useKifPlayerUI() {
  const [isMovesVisible, setIsMovesVisible] = useState<boolean>(false);


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
  };
}
