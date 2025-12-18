import { useState, useEffect } from 'react'
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

import type { KifLearningRecord, KifLearningStore } from "../types/kifLearning";

const LEARNING_FILE = "kif-learning.json";

export const useKifLearningPersist = () => {
  const load = async (): Promise<Record<string, KifLearningRecord>> => {
    try {
      const result = await Filesystem.readFile({
        path: LEARNING_FILE,
        directory: Directory.Data,
        encoding: Encoding.UTF8,
      });
      const text = typeof result.data === "string" ? result.data : await result.data.text();
      const parsed: unknown = JSON.parse(text);
      if ((parsed as any)?.version === 1) {
        return (parsed as KifLearningStore).records ?? {};
      }
    } catch {}
    return {};
  };

  const save = async (records: Record<string, KifLearningRecord>) => {
    const store: KifLearningStore = { version: 1, records };
    await Filesystem.writeFile({
      path: LEARNING_FILE,
      directory: Directory.Data,
      data: JSON.stringify(store),
      encoding: Encoding.UTF8,
    }).catch(() => {});
  };

  return { load, save };
};
