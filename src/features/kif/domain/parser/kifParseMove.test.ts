// utils/parser/handParser.test.ts
import { describe, it, expect } from 'vitest'
import { parseMoveLine, } from "./kifParseMove";
import { positions } from '@mui/system';

describe("parseMoveLineText", () => {
    it("move lineを parse", () => {
        const result = parseMoveLine("   3 ２五歩(26)        ( 0:00/00:00:00)");

        expect(result).toEqual({
            ok: true,
            value: {
            moveNumber: 3,
            moveText: "２五歩",
            piece: {
                key: "歩",
                owner:'black',
            },
            position: { file: 2, rank: 5 },
            from: { file: 2, rank: 6 },
            drop: false,
            player:'black',
        }
        }
        )
    })

    it("同", () => {
        const result = parseMoveLine("   2 同　玉(13)        ( 0:00/00:00:00)", { file: 3, rank: 2 });
        expect(result).toEqual({
            ok: true, 
            value: {
            moveNumber: 2,
            moveText: "同　玉",
            piece: {
                key: "玉", 
                owner: 'white',
            },
            position: { file: 3, rank: 2 },
            from: { file: 1, rank: 3 },
            drop: false,
            player: 'white',
        }
        })

    })
    it("成らず", () => {
        const result = parseMoveLine("   5 ２四銀不成(25)         ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
            moveNumber: 5,
            moveText: "２四銀不成",
            piece: {
                key: "銀", 
                owner: 'black',
            },
            position: { file: 2, rank: 4 },
            from: { file: 2, rank: 5 },
            drop: false,
            player: 'black',
        }
        })
    })
    it("打", () => {
        const result = parseMoveLine("   5 ２四金打           ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true, 
            value: {
            moveNumber: 5,
            moveText: "２四金打",
            piece: {
                key: "金", 
                owner: 'black',
            },
            position: { file: 2, rank: 4 },
            from: null,
            drop: true,
            player: 'black',
        }
        })
    })
    it("右", () => {
        const result = parseMoveLine("   5 ２四金右(23)           ( 0:00/00:00:00)")
        expect(result).toEqual({
            ok: true, 
            value: {
            moveNumber: 5,
            moveText: "２四金右",
            piece: {
                key: "金", owner: 'black',
            },
            position: { file: 2, rank: 4 },
            from: { file: 2, rank: 3 },
            drop: false,
            player: 'black',
        }
        })
    })
    it("投了", () => {
        const result = parseMoveLine("115 投了 (00:00/00:00:00)")
        expect(result).toEqual({
            ok: true,
            value: {
                type: "resign"

            }
        })
    })
    it("不正値", () => {
        const result = parseMoveLine("20 金３２(44)")
        expect(result).toEqual({
            ok: false,
            error: {
                message: "invalid move: 金３２: NaN undefined"
            }
        })
    })
})

