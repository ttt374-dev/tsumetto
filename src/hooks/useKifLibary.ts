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

        const dataStr =
          typeof result.data === "string"
            ? result.data
            : await result.data.text();

        const savedLib = JSON.parse(dataStr)
        setLibrary(savedLib);
       
      } catch {
        setLibrary([]);
      }
    })();
  }, []);

  const persist = async (next: KifLibraryEntry[]) => {
    setLibrary(next);
    await Filesystem.writeFile({
      path: LIB_FILE,
      data: JSON.stringify(next),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };

  const importFile = async (file: File) => {
    const buf = await file.arrayBuffer();
    const text = new TextDecoder("shift_jis").decode(buf);
    const kifData = parseKif(text);

    const entry: KifLibraryEntry = {
      id: uuidv4(),
      title: file.name,
      source: file.name,
      kifData,
      createdAt: Date.now(),
    };

    await persist([...library, entry]);
    return entry; // ★ player 側で即ロードできる
  };

  const clearLibrary = async () => {
    setLibrary([]);
    try {
      await Filesystem.deleteFile({
        path: LIB_FILE,
        directory: Directory.Data,
      });
    } catch {}
  };

  const findById = (id: string) =>
    library.find((e) => e.id === id);

  return {
    library,
    importFile,
    clearLibrary,
    findById,
  };
}
