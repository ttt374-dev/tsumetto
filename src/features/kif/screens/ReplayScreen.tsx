
import { useState, useMemo } from 'react'
import BoardView from '../components/player/BoardView/BoardView'
import { createBoard } from '../types'
import type { Move, Board, Hand, Position } from '../types'
import { parseMoveLine } from '../utils/kifParseMoveLine'
import { parseMoves } from '../utils/kifParser'
import { PreviewSharp } from '@mui/icons-material'
import { useKifReplay } from '../hooks/player/useKifReplay'

export default function ReplayScreen() {
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

    const str = `手数----指手---------消費時間--
     25 ４五歩(46)        ( 0:00/00:00:00)
  26 ３五歩(34)        ( 0:00/00:00:00)
  27 同　歩(36)        ( 0:00/00:00:00)
  28 ４五歩(44)        ( 0:00/00:00:00)
  29 ２四歩(25)        ( 0:00/00:00:00)
  30 ８八角成(33)       ( 0:00/00:00:00)
  31 同　銀(79)        ( 0:00/00:00:00)
  32 ３六歩打           ( 0:00/00:00:00)
  33 ２三歩成(24)       ( 0:00/00:00:00)
  34 ３五飛(32)        ( 0:00/00:00:00)
  35 ２五飛(28)        ( 0:00/00:00:00)
  36 ３四銀(43)        ( 0:00/00:00:00)
  37 ３五飛(25)        ( 0:00/00:00:00)
  38 同　銀(34)        ( 0:00/00:00:00)
  39 ４五桂(37)        ( 0:00/00:00:00)
  40 ２九飛打           ( 0:00/00:00:00)
  41 ３一飛打           ( 0:00/00:00:00)
  42 ４四角打           ( 0:00/00:00:00)
  43 ５五角打           ( 0:00/00:00:00)
  44 ２三飛成(29)       ( 0:00/00:00:00)
  45 ４四角(55)        ( 0:00/00:00:00)
  46 同　銀(35)        ( 0:00/00:00:00)
  47 ３六飛成(31)       ( 0:00/00:00:00)
  48 ３五歩打           ( 0:00/00:00:00)
  49 ４七龍(36)        ( 0:00/00:00:00)
  50 ３六角打           ( 0:00/00:00:00)
  51 同　龍(47)        ( 0:00/00:00:00)
  52 同　歩(35)        ( 0:00/00:00:00)
  53 ４六歩打           ( 0:00/00:00:00)
  54 ２九龍(23)        ( 0:00/00:00:00)
  55 ３九歩打           ( 0:00/00:00:00)
  56 ３七歩成(36)       ( 0:00/00:00:00)
  57 同　銀(48)        ( 0:00/00:00:00)
  58 ３九龍(29)        ( 0:00/00:00:00)
  59 ６六角打           ( 0:00/00:00:00)
  60 ３七龍(39)        ( 0:00/00:00:00)
  61 ４四角(66)        ( 0:00/00:00:00)
  62 ４六龍(37)        ( 0:00/00:00:00)
  63 １一角成(44)       ( 0:00/00:00:00)
  64 ４五龍(46)        ( 0:00/00:00:00)
  65 １二角打           ( 0:00/00:00:00)

  21 ３七桂(29)        ( 0:00/00:00:00)`
    const lines = str.split("\n")
    /*const lines = ["手数",
        "   1 ２四角成(42)       ( 0:00/00:00:00)",
        //"   4 投了         ( 0:00/00:00:00)",
        "   1 ２四金打           ( 0:00/00:00:00)",
        "2 同　玉(23)        ( 0:00/00:00:00)",
        "3 ３四飛成(32)       ( 0:00/00:00:00)"]
        */
    const moves = parseMoves(lines)
    //console.log("parsed move", moves)
    const empty: Move[] = []
    const { board, currentIndex, setCurrentIndex } = useKifReplay(initialBoard, hands, empty)

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