import { useDataContext } from "../context/DataContext";
import { useState } from "react";
import { PuzzleResponse } from "../data/model/PuzzleResponse";
import { useUserContext } from "../context/UserContext";

export function usePuzzle() {
    const { chessApiService } = useDataContext()
    const { jwt } = useUserContext()

    const [ dailyPuzzle, setDailyPuzzle ] = useState<PuzzleResponse | undefined>(undefined)
    const [ dailyPuzzleError, setDailyPuzzleError ] = useState<string | undefined>(undefined)

    const getDailyPuzzle = () => {
        if (jwt !== null) {
            chessApiService.getDailyPuzzle(jwt)
                .then(res => {
                    setDailyPuzzle(res.puzzle)
                    setDailyPuzzleError(res.error)
                })
        }
    }

    return { getDailyPuzzle, dailyPuzzle, dailyPuzzleError }
}