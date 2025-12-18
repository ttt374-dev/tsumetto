import { useKifLearning } from "./useKifLearning"
import { useKifLibrary } from "./useKifLibrary"
import { useKifSortedLibraryWithLearning } from "./useKifSortedLibraryWithLearning"

// hooks/useKifLibraryWithLearning.ts
export function useKifLibraryWithLearning() {
  const library = useKifLibrary()
  const learning = useKifLearning()

  const sortedLibrary = useKifSortedLibraryWithLearning(
    library.library,
    learning.records,
    library.sortKey,
    library.sortOrder
  )

  return {
    ...library,
    sortedLibrary,
  }
}
