// utils/parser/handParser.test.ts
import { describe, it, expect } from 'vitest'
import { parseMoveLine, } from "./kifParseMoveLine";
import { positions } from '@mui/system';

describe("parseMoveLineText", () => {
    it("move lineを parse", () => {
        const result = parseMoveLine("   3 ２五歩(26)        ( 0:00/00:00:00)");

        expect(result).toEqual({
            moveNumber: 3,
            moveText: "２五歩",
            piece: {
                key: "歩", isBlack: true,
            },
            position: { file: 2, rank: 5 },
            from: { file: 2, rank: 6 },
            drop: false,
            isBlack: true,
        }
        )
    })

    it("同", () => {
        const result = parseMoveLine("   2 同　玉(13)        ( 0:00/00:00:00)", {file: 3, rank: 2});
        expect(result).toEqual({
            moveNumber: 2,
            moveText: "同　玉",
            piece: {
                key: "玉", isBlack: false,
            },
            position: { file: 3, rank: 2 },
            from: { file: 1, rank: 3 },
            drop: false,
            isBlack: false,
        })

    })
    it("成らず", () => {
        const result = parseMoveLine("   5 ２四銀不成(25)         ( 0:00/00:00:00)")
        expect(result).toEqual({
            moveNumber: 5,
            moveText: "２四銀不成",
            piece: {
                key: "銀", isBlack: true,
            },
            position: { file: 2, rank: 4 },
            from: { file: 2, rank: 5},
            drop: false,
            isBlack: true,
        })
    })
    it("打", () => {
        const result = parseMoveLine("   5 ２四金打           ( 0:00/00:00:00)")
        expect(result).toEqual({
            moveNumber: 5,
            moveText: "２四金打",
            piece: {
                key: "金", isBlack: true,
            },
            position: { file: 2, rank: 4 },
            from: null,
            drop: true,
            isBlack: true,
        })
    })
    it("右", () => {
        const result = parseMoveLine("   5 ２四金右(23)           ( 0:00/00:00:00)")
        expect(result).toEqual({
            moveNumber: 5,
            moveText: "２四金右",
            piece: {
                key: "金", isBlack: true,
            },
            position: { file: 2, rank: 4 },
            from: { file:2, rank: 3 },
            drop: false,
            isBlack: true,
        })
    })
    it("投了", () => {
        const result = parseMoveLine("115 投了 (00:00/00:00:00)")
        expect(result).toEqual({
            type: "resign"
        })
    })
    it("不正値", () => {
        const result = parseMoveLine("20 金３２(44)")
        expect(result).toEqual({})
    })
})

