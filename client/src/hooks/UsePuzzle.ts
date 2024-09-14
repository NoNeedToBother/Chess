import { useDataContext } from "../context/DataContext";
import { useState } from "react";
import { useUserContext } from "../context/UserContext";
import { Puzzle } from "../models/Puzzle";

export function usePuzzle() {
    const { chessApiService } = useDataContext()
    const { jwt } = useUserContext()

    const [ dailyPuzzle, setDailyPuzzle ] = useState<Puzzle | undefined>(undefined)
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