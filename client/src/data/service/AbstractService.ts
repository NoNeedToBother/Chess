import {BaseResponse} from "../model/BaseResponse";
import axios, {isAxiosError} from "axios";
import {JwtInfo} from "../../models/JwtInfo";
import {REFRESH_TOKEN_ENDPOINT} from "../../utils/Endpoints";

export abstract class AbstractService {

    private onTokenRefreshed: ((jwt: JwtInfo) => void) | undefined = undefined;

    public setOnTokenRefreshedListener(onTokenRefreshed: (jwt: JwtInfo) => void) {
        this.onTokenRefreshed = onTokenRefreshed
    }

    protected async handleAxios<R extends BaseResponse>(block: (token?: string) => Promise<R>,
                                                        jwt?: JwtInfo): Promise<R | {error: string}> {
        try {
            return await block(jwt?.accessToken);
        } catch (e) {
            if (isAxiosError(e) && e.response !== undefined) {
                if (e.response.data.error !== undefined &&
                    e.response.data.error === "JWT token expired") {
                    if (jwt?.refreshToken !== undefined) {
                        return await this.refreshToken(block, jwt.refreshToken)
                    } else return {error: "JWT invalid"}
                }
                return {error: e.response.data.error as string}
            } else
                return {error: "Something went wrong..."}
        }
    }

    private async refreshToken<R extends BaseResponse>(block: (token?: string) => Promise<R>,
                                                       refreshToken: string): Promise<R | {error: string}> {
        let resp = await axios.post<{
            accessToken?: string;
            refreshToken?: string;
            error?: string
        }>(
            REFRESH_TOKEN_ENDPOINT,
            {token: refreshToken}
        )
        if (resp.data.refreshToken !== undefined && resp.data.accessToken !== undefined) {
            this.onTokenRefreshed?.({accessToken: resp.data.accessToken, refreshToken: resp.data.refreshToken})
            return block(resp.data.accessToken)
        } else if (resp.data.error !== undefined) return {error: resp.data.error}
        else return {error: "Something went wrong..."}
    }

}