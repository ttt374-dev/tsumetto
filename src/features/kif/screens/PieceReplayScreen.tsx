
import { useState, useMemo } from 'react'
import BoardView from '../components/player/BoardView/BoardView'
import { createBoard } from '../types'
import type { Move, Board, Hand, Position } from '../types'
import { parseMoveLine } from '../utils/kifParseMoveLine'
import { parseMoves } from '../utils/kifParser'
import { PreviewSharp } from '@mui/icons-material'

export default function PieceReplayScreen() {
    const initialBoard = createBoard()
    const hands = { black: "", white: ""}

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
    const [ currentIndex, setCurrentIndex ] = useState(0)
    const lines = ["手数",
        "   1 ２四角成(42)       ( 0:00/00:00:00)",
        "   4 投了         ( 0:00/00:00:00)",
        "   1 ２四金打           ( 0:00/00:00:00)",
    "2 同　玉(23)        ( 0:00/00:00:00)",
    "3 ３四飛成(32)       ( 0:00/00:00:00)"]   
   const moves = parseMoves(lines)
    console.log("parsed move", moves)
    const board = useMemo(
        () => buildBoardUntil(currentIndex),
        [currentIndex]
    );
    


    function posToIndex(pos: Position) {
        return {
            x: pos.file - 1,
            y: pos.rank - 1,
        }
    }

    function applyMove(board: Board, hands: Hand, move: Move){
        const {x, y} = posToIndex(move.position)
        board[y][x] = move.piece
        //board[move.position.file][move.position.rank] = move.piece
            
    }
    function buildBoardUntil(index: number): Board {
        const board = cloneBoard(initialBoard);

        for (let i = 0; i < index; i++) {
            applyMove(board, hands, moves[i]);
        }

        return board;
    }
    function cloneBoard(board: Board): Board {
        return board.map(row =>
            row.map(cell => (cell ? { ...cell } : null))
        );
    }

    return (<>
    <h3>Test</h3>
        
        <BoardView board={board} hands={hands}/>

        <button onClick={() => setCurrentIndex(currentIndex-1)}>
            Prev
        </button>
        <button onClick={() => setCurrentIndex(currentIndex+1)}>
            Next
        </button>

        
        
    </>)
}