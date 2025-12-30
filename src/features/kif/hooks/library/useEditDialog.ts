import type { Problem } from "../../types"
import type { ProblemRepositoryApi } from "../problem/useProblemRepository"

export function useEditDialog(problemId: string | null, repository: ProblemRepositoryApi){
    const updateTitle = (title: string) => {
        const targetProblem: Problem | null = problemId !== null ? repository.findById(problemId) : null
        if (!targetProblem) return 
        const newProblem: Problem = {...targetProblem, title: title}
        repository.update(newProblem)
    }
    
    const remove = () => {
        problemId && repository.remove(problemId)
    }
    return {
        updateTitle, remove,
    }
}