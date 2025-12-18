import { useState } from "react";
import type { KifLibraryEntry } from "../types/kifLibrary";

export function useLibraryHandlers(kifLibrary: any, kifPlayer: any, navigate: (path: string) => void) {
    const [checkedIds, setCheckedIds] = useState<Set<string>>(new Set());
    const library = kifLibrary.library;

    const importFileAndPlay = async (file: File) => {
        try {
            const newEntry = await kifLibrary.importFile(file);
            const index = library.findIndex((e: KifLibraryEntry) => e.id === newEntry.id);
            if (index !== -1) {
                kifPlayer.playLast();
                navigate("/player");
            }
        } catch (err) {
            console.error("ファイルのインポートに失敗しました", err);
        }
    };

    const selectEntry = (entry: KifLibraryEntry) => {
        kifPlayer.playByEntryId(entry.id);
        navigate("/player");
    };

    const toggleCheckbox = (id: string) => {
        setCheckedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const selectAll = () => setCheckedIds(new Set(library.map((e: KifLibraryEntry) => e.id)));
    const clearAll = () => setCheckedIds(new Set());

    const deleteSelected = async () => {
        if (checkedIds.size === 0) return;
        const ok = window.confirm(`選択された ${checkedIds.size} 件を削除しますか？`);
        if (!ok) return;

        const entriesToDelete = library.filter((e: KifLibraryEntry) => checkedIds.has(e.id));
        if (entriesToDelete.length === 0) {
            clearAll();
            return;
        }

        await kifLibrary.deleteEntries(entriesToDelete);
        clearAll();
    };

    return {
        checkedIds,
        importFileAndPlay,
        selectEntry,
        toggleCheckbox,
        selectAll,
        clearAll,
        deleteSelected
    };
}
