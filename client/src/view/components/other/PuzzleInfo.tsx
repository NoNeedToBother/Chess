import React from "react";
import { Puzzle } from "../../../models/Puzzle";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";

export interface PuzzleInfoProps {
    puzzle: Puzzle
    correct: boolean | null
    moveMessage: string
}

export function PuzzleInfo({ puzzle, correct, moveMessage }: PuzzleInfoProps) {
    return <div className="p-4 flex flex-col justify-center border-4 border-gray-400 dark:border-gray-800 shadow-md rounded-r bg-gray-100 dark:bg-gray-700">
        { correct !== null &&
            <div className="flex flex-row mx-auto">
                { correct ? <CheckIcon className="h-10 text-green-600"/> : <XMarkIcon className="h-10 text-red-600"/> }
                <div className={ correct ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400" }>{ moveMessage }</div>
            </div>
        }
        <div className="text-2xl font-bold mx-auto dark:text-gray-100">{ `Rating: ${ puzzle.rating }` }</div>
    </div>
}