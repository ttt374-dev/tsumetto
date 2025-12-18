// hooks/useKifLibrary.ts
import { useState, useEffect, useMemo } from "react";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { v4 as uuidv4 } from "uuid";
import { parseKif } from "../utils/kifParser";
import { type KifLibraryEntry, type KifLibraryState } from "../types/kifLibrary";
import type { SortKey, SortOrder } from '../types/kifLibrary'
import { useSortedKifLibrary } from "./useSortedKifLibrary";


export function useKifLibraryStore() {
  const [state, setState] = useState<KifLibraryState>({
    library: [],
    sortKey: "createdAt",
    sortOrder: "asc",
  })

  const setLibrary = (library: KifLibraryEntry[]) =>
    setState(prev => ({ ...prev, library }))

  const setSortKey = (sortKey: SortKey) =>
    setState(prev => ({ ...prev, sortKey }))

  const toggleSortOrder = () =>
    setState(prev => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }))

  return {
    state,
    setLibrary,
    setSortKey,
    toggleSortOrder,
  }
}
