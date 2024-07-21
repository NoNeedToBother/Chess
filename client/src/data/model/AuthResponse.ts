import {JwtInfo} from "../../models/JwtInfo";
import {UserModelResponse} from "./UserResponse";
import {User} from "../../models/User";
import {BaseResponse} from "./BaseResponse";

export interface AuthDataResponse extends BaseResponse {
    user?: UserModelResponse;
    jwtInfo?: JwtInfo;
}

export interface AuthResponse extends BaseResponse {
    user?: User;
    jwtInfo?: JwtInfo;
}

export interface JwtInfoDataResponse extends BaseResponse {
    accessToken?: string;
    refreshToken?: string
}