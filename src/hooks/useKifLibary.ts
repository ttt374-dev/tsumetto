// hooks/useKifLibrary.ts
import { useState, useEffect } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../kifParser";
import { type KifLibraryEntry } from "../types";

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


const importFile = async (file: File) => {
  const buf = await file.arrayBuffer();
  const text = new TextDecoder("shift_jis").decode(buf);
  const kifData = parseKif(text);

  let baseName = file.name;
  let ext = "";
  const dotIndex = file.name.lastIndexOf(".");
  if (dotIndex >= 0) {
    baseName = file.name.slice(0, dotIndex);
    ext = file.name.slice(dotIndex); // ".kif" などの拡張子
  }

  // 重複チェック
  let newTitle = baseName + ext;
  let counter = 1;
  const existingTitles = new Set(library.map((e) => e.kifData.title));
  while (existingTitles.has(newTitle)) {
    newTitle = `${baseName}(${counter})${ext}`;
    counter++;
  }
  kifData.title = newTitle

  const entry: KifLibraryEntry = {
    id: uuidv4(),
    //title: newTitle,
    //source: file.name,
    kifData,
    createdAt: Date.now(),
  };

  await persist([...library, entry]);
  return entry; // ★ player 側で即ロードできる
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
    clearLibrary,
    findById,
    deleteEntry,
  };
}
