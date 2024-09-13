import { BaseResponse } from "./BaseResponse";

export interface DailyPuzzleResponse extends BaseResponse {
    puzzle?: PuzzleResponse
}

export interface PuzzleResponse {
    fen: string
    rating: number
    solution: string[]
    themes: string[]
}