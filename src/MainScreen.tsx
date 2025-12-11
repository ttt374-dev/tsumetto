import React, { useState } from "react";

import BoardView from './BoardView'
import { parseKif } from './kifParser'
import { type Piece } from './types'

type Board = (Piece | null)[][]; // [rank][file]：1〜9が index 0〜8 の 2次元配列

export default function MainScreen() {
    const [board, setBoard] = useState<Board | null>(null);

    const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        // text に KIF 日本語が正しく入る
        const board = parseKif(text);
        setBoard(board);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>KIF 読み込み表示</h2>

            <input type="file" accept=".kif,.txt" onChange={handleFileLoad} />

            {board && (
                <div style={{ marginTop: 20 }}>
                    <BoardView board={board} />
                </div>
            )}
        </div>
    );
}
