import { BaseResponse } from "./BaseResponse";
import { Puzzle } from "../../models/Puzzle";

export interface DailyPuzzleResponse extends BaseResponse {
    puzzle?: Puzzle
}