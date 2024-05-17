import {BaseResponse} from "../model/BaseResponse";
import {isAxiosError} from "axios";

export abstract class AbstractService {
    protected handleAxios<R extends BaseResponse>(block: () => Promise<R>) {
        try {
            return block()
        } catch (e: unknown) {
            if (isAxiosError(e) && e.response !== undefined) {
                let body = JSON.parse(e.response.data)
                return {error: body.error as string }
            }
            else return { error: "Something went wrong..." }
        }
    }
}