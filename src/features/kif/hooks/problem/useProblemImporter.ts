import { useProblemRepository } from "./useProblemRepository";
import { parseKif } from "../../domain/parser/"
import type { Problem } from "../../types";
import { v4 } from "uuid";
import { useKif } from "../useKif";

export function useProblemImporter() {
    const { problemRepository} = useKif()
  const { add } = problemRepository;

  const importFiles = async (files: File[]): Promise<void> => {
    for (const file of files) {
      try {
        // 1. ファイル解析 → KifContent
        const buf = await file.arrayBuffer();
        const text = new TextDecoder("shift_jis").decode(buf);
        const kifContent = parseKif(text);
        if (!kifContent.ok){
            console.log(kifContent.error.message)
            continue
        }


        // 2. Problem 作成
        const problem: Problem = {
          id: v4(),
          title: file.name,  // TODO: 重複処理
          //title: kifContent.header?.title || file.name,
          //headers: kifContent.header?.lines || [],
          createdAt: Date.now(),
          kifData: kifContent.value,
        };

        // 3. Repository に追加
        await add(problem);
      } catch (e) {
        console.error(`Failed to import file ${file.name}:`, e);
      }
    }
  };

  return { importFiles };
}
