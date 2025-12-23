//import { useKifLearning } from "../learning/useKifLearning"
//import { useKifLibrary } from "./useKifLibrary"
import type { KifBackupV1 } from "../../types/kifBackup"
import { useKif } from '../useKif'

export function useKifBackupRestore() {
  //const kifLibrary = useKifLibrary()
  //const kifLearning = useKifLearning()
  const { kifEntryController, kifLearning } = useKif()

  const backup = (): KifBackupV1 => {
    return {
      version: 1,
      exportedAt: Date.now(),
      library: kifEntryController.entries,
      learning: kifLearning.records,
    }
  }

  const restore = (data: unknown) => {
    //console.log("restore", data)
    if (!isValidBackup(data)) {
      throw new Error("Invalid backup file")
    }

    // ⚠️ 順序重要
    kifEntryController.replaceAll(data.library)
    kifLearning.replaceAll(data.learning)
  }

  function isValidBackup(data: any): data is KifBackupV1 {
  return (
    data &&
    data.version === 1 &&
    Array.isArray(data.library) &&
    typeof data.learning === "object"
  )
}


    return { backup, restore }
}
