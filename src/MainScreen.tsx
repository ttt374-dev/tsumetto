import { useState } from "react";

import BoardView from './components/BoardView'
import { parseKif } from './kifParser'
import { type Board, type Hand, type Move } from './types'
import FileButton from "./components/FileButton";
import FolderSelectButton from "./components/FolderSelectButton";

export default function MainScreen() {
    const [board, setBoard] = useState<Board | null>(null);
    const [hands, setHands ] = useState<Hand>({ black: "", white: ""})
    const [moves, setMoves ] = useState<Move[]>([])
    const [filename, setFilename] = useState<string>("")
    const [kifFiles, setKifFiles] = useState<File[]>([]);


    const loadFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        // text に KIF 日本語が正しく入る
        const { board, hands, moves } = parseKif(text);
        setBoard(board);
        setHands(hands)
        setMoves(moves)
        setFilename(file.name)
    }
    const loadFolder = async (files: File[]) => {
        const kif = files.filter(f => f.name.toLowerCase().endsWith(".kif"));
        setKifFiles(kif);
    }
    
    function handleRandomPick() {
        if (kifFiles.length === 0) return;

        const random = kifFiles[Math.floor(Math.random() * kifFiles.length)];
        console.log(random.name)
        loadFile(random)
        //setFilename(random.name)
        //loadKif(random); // あなたの既存の読み込み関数
    }
    return (
        <div style={{ padding: 20 }}>
            <h2>TSUME READER</h2>
            <div>
            {board && (
                <div style={{ marginTop: 20 }}>
                    <BoardView board={board} hands={hands} moves={moves}/>
                </div>
            )}
            </div>
            
            <div>
                Filename: {filename ? filename : "Not Selected"}
            </div>
            <div>
                <FileButton onFileSelected={loadFile} />
                <FolderSelectButton onSelected={loadFolder} />
                <button onClick={handleRandomPick} disabled={kifFiles.length === 0}>
                    ランダムで選ぶ
                </button>
            </div>

        </div>
    );
}
