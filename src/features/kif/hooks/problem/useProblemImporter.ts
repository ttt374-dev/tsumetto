import { useProblemRepository } from "./useProblemRepository";
import { parseKif } from "../../domain/parser/"
import type { Problem } from "../../types";
import { v4 } from "uuid";
import { useKif } from "../useKif";

export function useProblemImporter() {
    const { problemRepository} = useKif()
  const { add, addMany } = problemRepository;

  const existingTitles = problemRepository.problems.map(p => p.title);
  function generateUniqueTitle(baseTitle: string, existingTitles: string[]): string {
    if (!existingTitles.includes(baseTitle)) {
      return baseTitle;
    }

    let counter = 1;
    let newTitle = `${baseTitle} (${counter})`;

    while (existingTitles.includes(newTitle)) {
      counter++;
      newTitle = `${baseTitle} (${counter})`;
    }

    return newTitle;
  }


  const importFiles = async (files: File[]): Promise<void> => {
    const problems: Problem[] = [] // to import
    console.log("files to import", files)
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
          //title: file.name,  // TODO: 重複処理
          title: generateUniqueTitle(file.name, existingTitles),
          //title: kifContent.header?.title || file.name,
          //headers: kifContent.header?.lines || [],
          createdAt: Date.now(),
          kifData: kifContent.value,
        };

        // 3. Repository に追加
        //await add(problem);        
        problems.push(problem)
      } catch (e) {
        console.error(`Failed to import file ${file.name}:`, e);
      }
    }
    try {
      console.log("import files", problems)
      await addMany(problems)
    } catch (e) {
        console.error(`Failed to import files ${ files}:`, e); // TODO: error msg
      }
  };

  return { importFiles };
}
