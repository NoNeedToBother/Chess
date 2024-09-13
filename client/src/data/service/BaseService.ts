import { BaseResponse } from "../model/BaseResponse";
import axios, { isAxiosError } from "axios";
import { JwtInfo } from "../../models/JwtInfo";
import { REFRESH_TOKEN_ENDPOINT } from "../../utils/Endpoints";
import { JwtInfoDataResponse } from "../model/AuthResponse";

export abstract class BaseService {

    private onTokenRefreshed: ((jwt: JwtInfo) => void) | undefined = undefined

    public setOnTokenRefreshedListener(onTokenRefreshed: (jwt: JwtInfo) => void) {
        this.onTokenRefreshed = onTokenRefreshed
    }

    private onUserBanned: ((response: BaseResponse) => void) | undefined = undefined

    public setOnUserBannedListener(onUserBanned: (response: BaseResponse) => void) {
        this.onUserBanned = onUserBanned
    }

    protected async handleAxios<R extends BaseResponse>(block: (token?: string) => Promise<R>,
                                                        jwt?: JwtInfo): Promise<R | {error: string}> {
        try {
            const result = await block(jwt?.accessToken);
            if (result.error !== undefined) {
                if (result.error === "Account is banned") this.onUserBanned?.(result)
            }
            return result
        } catch (e) {
            if (isAxiosError(e) && e.response !== undefined) {
                if (e.response.data.error !== undefined &&
                    e.response.data.error === "JWT token invalid") {
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
        const resp = await axios.post<JwtInfoDataResponse>(
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