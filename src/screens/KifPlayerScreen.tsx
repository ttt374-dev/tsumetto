import { useState } from "react";

import BoardView from '../components/BoardView'
import { parseKif } from '../kifParser'
import { type KifData } from '../types'
import FileButton from "../components/FileButton";

export default function KifPlayerScreen() {
    const [kifData, setKifData] = useState<KifData>()
    const loadFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);

        //const { board, hands, moves } = parseKif(text);
        const kifData = parseKif(text)                
        setKifData(kifData)
    }
    return (
        <div style={{ padding: 20 }}>
            <h2>TSUME READER</h2>
            <div>
            {kifData && kifData.board && (
                <div style={{ marginTop: 20 }}>
                    <BoardView kifData={kifData}/>
                </div>
            )}
            </div>            
            
            <div>
                <FileButton onFileSelected={loadFile} />
            </div>

        </div>
    );
}
