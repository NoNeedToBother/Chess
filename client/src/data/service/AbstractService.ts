import {BaseResponse} from "../model/BaseResponse";
import {isAxiosError} from "axios";

export abstract class AbstractService {
    protected handleAxios<R extends BaseResponse>(block: () => Promise<R>) {
        return block().catch((e: unknown) => {
            if (isAxiosError(e) && e.response !== undefined) {
                return {error: e.response.data.error as string}
            }
            else return { error: "Something went wrong..." }
        })
    }
}