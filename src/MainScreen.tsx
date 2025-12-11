import React, { useState } from "react";

import BoardView from './BoardView'
import { parseKif } from './kifParser'
import { type Board, type Hand, type Move } from './types'


export default function MainScreen() {
    const [board, setBoard] = useState<Board | null>(null);
    const [hands, setHands ] = useState<Hand>({ black: "", white: ""})
    const [moves, setMoves ] = useState<Move[]>([])
    const [filename, setFilename] = useState<string>("")

    const [kifFiles, setKifFiles] = useState<File[]>([]);

    function handleFolderLoad(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files || []);
        const kif = files.filter(f => f.name.toLowerCase().endsWith(".kif"));
        setKifFiles(kif);
    }
    
    const handleFileLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        loadFIle(file)
        
    };
    const loadFIle = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        // text に KIF 日本語が正しく入る
        const { board, hands, moves } = parseKif(text);
        setBoard(board);
        setHands(hands)
        setMoves(moves)
    }
    function handleRandomPick() {
        if (kifFiles.length === 0) return;

        const random = kifFiles[Math.floor(Math.random() * kifFiles.length)];
        console.log(random.name)
        loadFIle(random)
        setFilename(random.name)
        //loadKif(random); // あなたの既存の読み込み関数
    }
    return (
        <div style={{ padding: 20 }}>
            <h2>TSUMI READER</h2>

            <input type="file" accept="*/*" onChange={handleFileLoad} />
            <input
                type="file"
                  {...{ webkitdirectory: "" } as any}
                onChange={handleFolderLoad}
            />

            <button onClick={handleRandomPick}>
                ランダムで選ぶ
            </button>
            {filename}
            {board && (
                <div style={{ marginTop: 20 }}>
                    <BoardView board={board} hands={hands} moves={moves}/>
                </div>
            )}
        </div>
    );
}
