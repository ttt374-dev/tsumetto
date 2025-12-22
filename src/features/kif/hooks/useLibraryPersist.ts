// hooks/useKifLibrary.ts
import { useState, useEffect, useMemo } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../utils/kifParser";
import { type KifEntry } from "../types/kifEntity";
//import type { SortKey, SortOrder } from '../types/kifEntity'
import { useSortedKifLibrary } from "./useSortedKifLibrary";
import { useKifLibraryStore } from "./useKifLibraryStore";

const LIB_FILE = "kifLibrary.json";

export function useKifLibraryPersist() {
  const load = async (): Promise<KifEntry[]> => {
    const result = await Filesystem.readFile({
      path: LIB_FILE,
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });

    const dataStr =
      typeof result.data === "string"
        ? result.data
        : await result.data.text();

    const parsed = JSON.parse(dataStr);
    console.log("persiste loaded", parsed)
    return Array.isArray(parsed) ? parsed : [];
  };

  const save = async (library: KifEntry[]) => {
    await Filesystem.writeFile({
      path: LIB_FILE,
      data: JSON.stringify(library),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };

  const clear = async () => {
    await Filesystem.deleteFile({
      path: LIB_FILE,
      directory: Directory.Data,
    });
  };

  return { load, save, clear };
}
