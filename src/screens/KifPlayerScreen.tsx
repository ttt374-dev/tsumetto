import BoardView from '../components/BoardView'
import FileButton from "../components/FileButton";
import { useKifPlayer } from "../hooks/useKifPlayer";

export default function KifPlayerScreen() {    
    const { kifPlayerState, loadFromText } = useKifPlayer();
    
    const loadFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        loadFromText(text, file.name);        

    }
    const kifData = kifPlayerState.kifData
    return (
        <div style={{ padding: 20 }}>
            <h2>TSUME READER</h2>
            <div>
                {kifData && kifData.board && (
                    <div style={{ marginTop: 20 }}>
                        <BoardView kifData={kifData} />
                    </div>
                )}
            </div>

            <div>
                <FileButton onFileSelected={loadFile} />
            </div>

        </div>
    );
}
