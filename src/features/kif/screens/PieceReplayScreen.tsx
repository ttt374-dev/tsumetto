
import { useState, useMemo } from 'react'
import BoardView from '../components/player/BoardView/BoardView'
import { createBoard } from '../types'
import type { Move, Board, Hand, Position } from '../types'
import { parseMoveLine } from '../utils/kifParseMoveLine'
import { parseMoves } from '../utils/kifParser'
import { PreviewSharp } from '@mui/icons-material'
import { useKifReplay } from '../hooks/player/useKifReplay'

export default function PieceReplayScreen() {
    const initialBoard = createBoard()
    const hands = { black: "", white: "" }

    const moveLine = "   1 ２四角成(42)       ( 0:00/00:00:00)"
    //const move = parseMoveLine(moveLine)
    //console.log("parsed move", move)
    /*
    const moves = [
        parseMoveLine("   1 ２四龍(42)       ( 0:00/00:00:00)"),
        parseMoveLine("   2 同　成銀(32)       ( 0:00/00:00:00)", {file: 2, rank: 4}),
        parseMoveLine("   3 ３四飛(32)       ( 0:00/00:00:00)")
    ].filter((v): v is any => v !== null);
    */
    //const currentIndex = 2

    const lines = ["手数",
        "   1 ２四角成(42)       ( 0:00/00:00:00)",
        //"   4 投了         ( 0:00/00:00:00)",
        "   1 ２四金打           ( 0:00/00:00:00)",
        "2 同　玉(23)        ( 0:00/00:00:00)",
        "3 ３四飛成(32)       ( 0:00/00:00:00)"]
    const moves = parseMoves(lines)
    console.log("parsed move", moves)
    const { board, currentIndex, setCurrentIndex } = useKifReplay(initialBoard, hands, moves)

    return (<>
        <h3>Test</h3>
        <BoardView board={board} hands={hands} />

        <button onClick={() => { currentIndex > 0 && setCurrentIndex(currentIndex - 1) }}>
            Prev
        </button>
        <button onClick={() => { currentIndex < moves.length - 1 && setCurrentIndex(currentIndex + 1) }}>
            Next
        </button>



    </>)
}