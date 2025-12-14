    import BoardView from '../components/BoardView'
    import FileButton from "../components/FileButton";
    import { createKifData, useKifPlayer } from "../hooks/useKifPlayer";
    import { type KifPlayerState } from '../types';
    
    export function useDisplayKifData(state: KifPlayerState) {
        return state.kifData ?? createKifData();
    }

    export default function KifPlayerScreen() {
        const { kifPlayerState, loadFromLibrary, library, importFile, playNext, playPrev } = useKifPlayer();
        const handleSelectLibrary = (id: string) => {
            loadFromLibrary(id)            
        }
        const kifData = useDisplayKifData(kifPlayerState)
        console.log("current index", kifPlayerState.currentLibraryIndex)

        return (
            <div style={{ padding: 20 }}>
                <h2>TSUME READER</h2>
                <div>

                    <div style={{ marginTop: 20 }}>
                        <BoardView
                            board={kifData.board}
                            moves={kifData.moves}
                            hands={kifData.hands}
                        />
                    </div>
                </div>

                <div>
                    { kifPlayerState.currentLibraryIndex !== undefined && `${kifPlayerState.currentLibraryIndex + 1}: ${kifPlayerState.title}`}
                </div>
                <div style={{ marginTop: 20 }}>
                    <button onClick={playPrev}>前の棋譜</button>
                    <button onClick={playNext}>次の棋譜</button>
                </div>


                {/* ファイル選択ボタン */}
                <FileButton label="Import File" onFileSelected={importFile} />

                {/* 内部リストを選択 */}                
                <select 
                    value={kifPlayerState.currentLibraryIndex ?? ""}
                    onChange={(e) => handleSelectLibrary(e.target.value)}>
                    {library.map((entry, i) => (
                        <option key={i} value={i}>{entry.title}</option>
                    ))}
                </select>
            </div>
        );
    }
