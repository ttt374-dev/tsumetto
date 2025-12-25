
import { useState, useMemo } from 'react'
import BoardView from '../components/player/BoardView/BoardView'
import { createEmptyBoard, createEmptyHand } from '../domain'
import { parseHandString } from '../utils/parser/kifParseHand'
import { parseMoves } from '../utils/parser/kifParseMove'
import { PreviewSharp } from '@mui/icons-material'
import { useKifReplay } from '../hooks/player/useKifReplay'

export default function ReplayScreen() {
    const initialBoard = createEmptyBoard()
    const hands = { black: createEmptyHand(), white: createEmptyHand() }

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

    const lines2 = `手数----指手---------消費時間--
   1 ７六歩(77)        ( 0:00/00:00:00)
   2 ３四歩(33)        ( 0:00/00:00:00)
   3 ２六歩(27)        ( 0:00/00:00:00)
   4 ４四歩(43)        ( 0:00/00:00:00)
   5 ４八銀(39)        ( 0:00/00:00:00)
   6 ３二飛(82)        ( 0:00/00:00:00)
   7 ２五歩(26)        ( 0:00/00:00:00)
   8 ３三角(22)        ( 0:00/00:00:00)
   9 ６八玉(59)        ( 0:00/00:00:00)
  10 ６二玉(51)        ( 0:00/00:00:00)
  11 ７八玉(68)        ( 0:00/00:00:00)
  12 ４二銀(31)        ( 0:00/00:00:00)
  13 ５八金(49)        ( 0:00/00:00:00)
  14 ９四歩(93)        ( 0:00/00:00:00)
  15 ９六歩(97)        ( 0:00/00:00:00)
  16 ７二銀(71)        ( 0:00/00:00:00)
  17 ３六歩(37)        ( 0:00/00:00:00)
  18 ７一玉(62)        ( 0:00/00:00:00)
  19 ４六歩(47)        ( 0:00/00:00:00)
  20 ５二金(41)        ( 0:00/00:00:00)
  21 ３七桂(29)        ( 0:00/00:00:00)
  22 ８二玉(71)        ( 0:00/00:00:00)
  23 ５六歩(57)        ( 0:00/00:00:00)
`.split("\n")
    const lines = ["手数",
        "   1 ２四角成(42)       ( 0:00/00:00:00)",
        "   1 ２四金打           ( 0:00/00:00:00)",
        "2 同　玉(23)        ( 0:00/00:00:00)",
        "3 ３四飛成(32)       ( 0:00/00:00:00)"]


    const moves = parseMoves(lines2)
    console.log("parsed move", moves)
    const { board, currentIndex, setCurrentIndex } = useKifReplay(initialBoard, hands, moves, null)
    
    const handsNew = { black: createEmptyHand(), white: createEmptyHand()}
    const hand = parseHandString("先手の持駒：金二 歩六 ")
    console.log("parse hands", hand)
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