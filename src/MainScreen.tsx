import React, { useState } from "react";

import BoardView from './BoardView'
import { parseKif } from './kifParser'
import { type Board, type Hand, type Move } from './types'


export default function MainScreen() {
    const [board, setBoard] = useState<Board | null>(null);
    const [hands, setHands ] = useState<Hand>({ black: "", white: ""})
    const [moves, setMoves ] = useState<Move[]>([])
    
    const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        // text に KIF 日本語が正しく入る
        const { board, hands, moves } = parseKif(text);
        setBoard(board);
        setHands(hands)
        setMoves(moves)
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>KIF 読み込み表示</h2>

            <input type="file" accept=".kif,.txt" onChange={handleFileLoad} />

            
            {board && (
                <div style={{ marginTop: 20 }}>
                    <BoardView board={board} hands={hands} moves={moves}/>
                </div>
            )}
        </div>
    );
}
