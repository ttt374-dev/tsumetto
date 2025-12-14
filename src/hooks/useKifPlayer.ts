import { useState } from 'react'
import { parseKif } from "../kifParser";
import { type Board, type KifData, type KifPlayerState, type KifLibraryEntry } from "../types";
import { v4 as uuidv4 } from "uuid";

export function useKifPlayer() {
    const [kifPlayerState, setKifPlayerState] = useState(createPlayState());
    const [library, setLibrary] = useState<KifLibraryEntry[]>([]);

    const loadFromText = (text: string, title?: string) => {
        setKifPlayerState(createPlayState({ kifData: parseKif(text), title: title }));
    };
    const loadFromFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        loadFromText(text, file.name);
    };
    // ファイルから棋譜を内部リストに登録（import）
    const importFile = async (file: File) => {
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        const kifData = parseKif(text);
        const entry: KifLibraryEntry = {
            id: uuidv4(),
            title: file.name,
            source: file.name,
            kifData,
        };
        setLibrary((prev) => [...prev, entry]);
    };

    // internal list から選択してロード
    const loadFromLibrary = (id: string) => {
        const entry = library.find((e) => e.id === id);
        if (entry) {
            setKifPlayerState(createPlayState({ kifData: entry.kifData, title: entry.title }));
        }
    };

    return { kifPlayerState, loadFromText, loadFromFile, importFile, loadFromLibrary, library };
}

///////////////////////////////////
// hooks/usePlayerState.ts
export const createPlayState = (
    partial?: Partial<KifPlayerState>
): KifPlayerState => ({
    kifData: null,
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
