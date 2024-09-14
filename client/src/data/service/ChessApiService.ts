import { BaseService } from "./BaseService";
import { DailyPuzzleResponse } from "../model/PuzzleResponse";
import { JwtInfo } from "../../models/JwtInfo";
import axios from "axios";
import { GET_DAILY_PUZZLE_ENDPOINT } from "../../utils/Endpoints";

export class ChessApiService extends BaseService {

    async getDailyPuzzle(jwt: JwtInfo): Promise<DailyPuzzleResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const resp = await axios.get<DailyPuzzleResponse>(
                GET_DAILY_PUZZLE_ENDPOINT,
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return resp.data
        })
    }
}