import { useState } from "react";

import BoardView from './components/BoardView'
import { parseKif } from './kifParser'
import { type Board, type Hand, type Move } from './types'
import FileButton from "./components/FileButton";

export default function MainScreen() {
    const [board, setBoard] = useState<Board | null>(null);
    const [hands, setHands ] = useState<Hand>({ black: "", white: ""})
    const [moves, setMoves ] = useState<Move[]>([])
    const [filename, setFilename] = useState<string>("")

    const loadFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        const { board, hands, moves } = parseKif(text);
        setBoard(board);
        setHands(hands)
        setMoves(moves)
        setFilename(file.name)
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
            </div>

        </div>
    );
}
