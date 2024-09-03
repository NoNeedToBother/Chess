import { BaseResponse } from "./BaseResponse";
import { UserDataResponse, UserResponse } from "./UserResponse";

export interface BanResponse extends BaseResponse {
    user?: UserResponse
}

export interface BanDataResponse extends BaseResponse {
    userData?: UserDataResponse
}