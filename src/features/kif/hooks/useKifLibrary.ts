// hooks/useKifLibrary.ts
import { useState, useEffect } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../utils/kifParser";
import { type KifLibraryEntry } from "../types/kif";

const LIB_FILE = "kifLibrary.json";

export function useKifLibrary() {
  const [library, setLibrary] = useState<KifLibraryEntry[]>([]);

  /* 永続化ロード */
  useEffect(() => {
    (async () => {
      try {
        const result = await Filesystem.readFile({
          path: LIB_FILE,
          directory: Directory.Data,
          encoding: Encoding.UTF8,
        });

        // result.data が string ならそのまま、Blob なら text() で string に変換
        let dataStr: string;
        if (typeof result.data === "string") {
          dataStr = result.data;
        } else {
          dataStr = await result.data.text();
        }

        const savedLib: unknown = JSON.parse(dataStr);
        if (Array.isArray(savedLib)) {
          setLibrary(savedLib as KifLibraryEntry[]);
        } else {
          setLibrary([]);
        }
        console.log("saved library", savedLib)
      } catch {
        setLibrary([]);
      }
    })();
  }, []);



  const persist = async (next: KifLibraryEntry[]) => {
    try {
      await Filesystem.writeFile({
        path: LIB_FILE,
        data: JSON.stringify(next),
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      setLibrary(next); // ファイル保存後に state 更新
    } catch (err) {
      console.error("Library persist failed", err);
    }
  };

// 単体ファイルをインポートして保存
const importFile = async (
  file: File,
  extraEntries: KifLibraryEntry[] = [] // importFiles から呼ぶ場合に追加分を渡す
): Promise<KifLibraryEntry> => {
  const buf = await file.arrayBuffer();
  const text = new TextDecoder("shift_jis").decode(buf);
  const kifData = parseKif(text);

  // ファイル名と拡張子を分離
  let baseName = file.name;
  let ext = "";
  const dotIndex = file.name.lastIndexOf(".");
  if (dotIndex >= 0) {
    baseName = file.name.slice(0, dotIndex);
    ext = file.name.slice(dotIndex);
  }

  // 重複チェック（既存＋追加分）
  let newTitle = baseName + ext;
  let counter = 1;
  const existingTitles = new Set([...library, ...extraEntries].map(e => e.kifData.title));
  while (existingTitles.has(newTitle)) {
    newTitle = `${baseName}(${counter})${ext}`;
    counter++;
  }
  kifData.title = newTitle;

  const entry: KifLibraryEntry = {
    id: uuidv4(),
    kifData,
    createdAt: Date.now(),
  };

  // 保存
  await persist([...library, ...extraEntries, entry]);
  return entry;
};

// 複数ファイルをまとめてインポート
const importFiles = async (files: File[]): Promise<KifLibraryEntry[]> => {
  const results: KifLibraryEntry[] = [];
  for (const file of files) {
    try {
      const entry = await importFile(file, results);
      results.push(entry);
    } catch (err) {
      console.error("Failed to import file:", file.name, err);
    }
  }
  return results;
};

  const deleteEntry = async (entry: KifLibraryEntry) => {
    try {
      const nextLibrary = library.filter((e) => e.id !== entry.id);
      await persist(nextLibrary);
      //setLibrary(nextLibrary)
    } catch (err) {
      console.error("Failed to delete entry:", err);
    }
  };
  const deleteEntries = async (entries: KifLibraryEntry[]) => {
    try {
      if (entries.length === 0) return;

      const deleteIds = new Set(entries.map(e => e.id));

      const nextLibrary = library.filter(
        (e) => !deleteIds.has(e.id)
      );

      console.log("delete entries", entries, deleteIds, nextLibrary)
      await persist(nextLibrary);
      // setLibrary(nextLibrary)
    } catch (err) {
      console.error("Failed to delete entries:", err);
    }
  };

  const clearLibrary = async () => {
    setLibrary([]);
    try {
      await Filesystem.deleteFile({
        path: LIB_FILE,
        directory: Directory.Data,
      });
    } catch { }
  };

  const findById = (id: string) =>
    library.find((e) => e.id === id);

  return {
    library,
    importFile,
    importFiles,
    clearLibrary,
    findById,
    deleteEntry,
    deleteEntries,
  };
}
