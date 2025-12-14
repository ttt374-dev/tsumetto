import { useState, useEffect } from 'react'
import { parseKif } from "../kifParser";
import { type Board, type KifData, type KifPlayerState, type KifLibraryEntry } from "../types";
import { v4 as uuidv4 } from "uuid";

// Capacitor
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
const LIB_FILE = "kifLibrary.json";

export function useKifPlayer() {
    const [kifPlayerState, setKifPlayerState] = useState(createPlayState());
    const [library, setLibrary] = useState<KifLibraryEntry[]>([]);

    // --- 永続化読み込み ---
    useEffect(() => {
        (async () => {
            try {
                const result = await Filesystem.readFile({
                    path: LIB_FILE,
                    directory: Directory.Data,
                    encoding: Encoding.UTF8,
                });
                // result.data は string | Blob なので型チェック
                let dataStr: string;
                if (typeof result.data === 'string') {
                    dataStr = result.data;
                } else {
                    // Blob → string に変換
                    dataStr = await result.data.text();
                }
                const savedLib: KifLibraryEntry[] = JSON.parse(dataStr);
                setLibrary(savedLib);
            } catch (e) {
                console.log("ライブラリ読み込み失敗（新規作成）", e);
                setLibrary([]);
            }
        })();
    }, []);
    
    const loadFromText = (text: string, title?: string) => {
        setKifPlayerState(createPlayState({ kifData: parseKif(text), title: title }));
    };
    const loadFromFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        loadFromText(text, file.name);
    };
    // ファイルから棋譜を内部リストに登録（import）
    // --- ファイルを内部ライブラリに追加 ---
    const importFile = async (file: File) => {
        try {            
            const buf = await file.arrayBuffer();
            const text = new TextDecoder("shift_jis").decode(buf);
            const kifData = parseKif(text);

            const entry: KifLibraryEntry = {
                id: uuidv4(),
                title: file.name,
                source: file.name,
                kifData: kifData,
            };

            const newLib = [...library, entry];
            setLibrary(newLib);

            // 永続化
            await Filesystem.writeFile({
                path: LIB_FILE,
                data: JSON.stringify(newLib),
                directory: Directory.Data,
                encoding: Encoding.UTF8,
            });

            // 同時にプレイヤーに読み込む場合
            setKifPlayerState(createPlayState({ kifData, title: file.name }));

        } catch (err) {
            console.error("ファイル読み込み失敗:", err);
        }
    };

    // internal list から選択してロード
    const loadFromLibrary = (id: string) => {
        const entry = library.find((e) => e.id === id);
        if (entry) {
            setKifPlayerState(createPlayState({ kifData: entry.kifData, title: entry.title }));
        }
    };
    // ライブラリから順番再生
    const playNext = () => {
        if (library.length === 0) return;

        let nextIndex = (kifPlayerState.currentLibraryIndex ?? -1) + 1;
        if (nextIndex >= library.length) nextIndex = 0; // ループ再生

        const entry = library[nextIndex];
        setKifPlayerState(createPlayState({
            kifData: entry.kifData,
            title: entry.title,
            currentLibraryIndex: nextIndex
        }));
    };

    const playPrev = () => {
        if (library.length === 0) return;

        let prevIndex = (kifPlayerState.currentLibraryIndex ?? 0) - 1;
        if (prevIndex < 0) prevIndex = library.length - 1; // ループ

        const entry = library[prevIndex];
        setKifPlayerState(createPlayState({
            kifData: entry.kifData,
            title: entry.title,
            currentLibraryIndex: prevIndex
        }));
    };

    return { kifPlayerState, setKifPlayerState, loadFromText, loadFromFile, importFile, loadFromLibrary, library, playNext, playPrev };
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayState = (
    partial?: Partial<KifPlayerState>
): KifPlayerState => ({    
    showAnswer: false,
    title: "",
    ...partial,
});

export function createKifData(
    partial?: Partial<KifData>
): KifData {
    return {
        board: createEmptyBoard(),
        hands: { black: "", white: "" },
        moves: [],
        ...partial,
    };
}


export const createEmptyBoard = (): Board =>
    Array.from({ length: 9 }, () =>
        Array.from({ length: 9 }, () => null)
    );
