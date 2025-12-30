// hooks/useKifLibrary.ts
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import type { Problem } from "../../types";

const LIB_FILE = "problem.json";

export function useProblemPersist() {
  async function load(): Promise<Problem[]> {
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
    //console.log("persiste loaded", parsed)
    return Array.isArray(parsed) ? parsed : [];
  };

  async function save(library: Problem[]) {
    await Filesystem.writeFile({
      path: LIB_FILE,
      data: JSON.stringify(library),
      directory: Directory.Data,
      encoding: Encoding.UTF8,
    });
  };
  // 新規：update
  async function update(updatedProblem: Problem) {
    const library = await load();
    const next = library.map((p) =>
      p.id === updatedProblem.id ? updatedProblem : p
    );
    await save(next);
  }

  async function clear() {
    await Filesystem.deleteFile({
      path: LIB_FILE,
      directory: Directory.Data,
    });
  };

  return { load, save, update, clear };
}
