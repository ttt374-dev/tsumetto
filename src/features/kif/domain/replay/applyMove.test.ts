import { applyMove } from "./applyMove";
import { describe, it, expect } from 'vitest'
import { createDefaultBoard } from "./createBoard";
import { createEmptyHand } from "./createHand";
import type { Hands, Move } from '../../types'

describe("apply move", () => {
    const defualtBoard = createDefaultBoard()

    it("simple move", () => {
        const board = createDefaultBoard()
        const hands: Hands = {
            black: createEmptyHand(),
            white: createEmptyHand(),
        }
        const move: Move =
        {
            moveNumber: 1,
            player: 'black',
            piece: {
                key: '歩',
                owner: 'black'
            },
            position: { file: 2, rank: 6},
            from: { file: 2, rank: 7 },
            drop: false,
            moveText: '',
        }
        applyMove(board, hands, move)

        const moveTo = board[5][1]
        const moveFrom = board[6][1]
        expect(moveFrom).toBeNull
        expect(moveTo).not.toBeNull
        expect(moveTo).toEqual({
            key: '歩', owner: 'black'
        })
    })
    it("打つ", () => {
        const board = createDefaultBoard()
        const blackHand = createEmptyHand()
        blackHand['歩'] = 3
        const hands: Hands = {
            black: blackHand,
            white: createEmptyHand(),
        }
        const move: Move =
        {
            moveNumber: 1,
            player: 'black',
            piece: {
                key: '歩',
                owner: 'black'
            },
            position: { file: 5, rank: 5},
            from: null,
            drop: true,
            moveText: '',
        }
        applyMove(board, hands, move)
        const dropTo = board[4][4]
        expect(dropTo).toEqual({
            key: '歩', owner: 'black'
        })
        expect(blackHand['歩']).toEqual(2)
    })
    it("相手の駒を取る", () => {
        const board = createDefaultBoard()
        const hands: Hands = {
            black: createEmptyHand(),
            white: createEmptyHand(),
        }
        board[4][4] = { key: '歩', owner: 'white'}
        const move: Move =
        {
            moveNumber: 1,
            player: 'black',
            piece: {
                key: '飛',
                owner: 'black'
            },
            position: { file: 2, rank: 3},
            from: { file: 2, rank: 8},
            drop: false,
            moveText: '',
        }
        const origCell = board[2][1]
        expect(origCell).toEqual(
            { key: '歩', owner: 'white'}
        )
        applyMove(board, hands, move)
        const moveTo = board[2][1]
        expect(moveTo).toEqual({
            key: '飛', owner: 'black'
        })
        expect(hands.black['歩']).toEqual(1)
    })
})