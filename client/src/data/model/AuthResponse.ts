import {JwtInfo} from "../../models/JwtInfo";
import {UserResponse} from "./UserResponse";
import {User} from "../../models/User";

export interface AuthDataResponse {
    user?: UserResponse;
    jwtInfo?: JwtInfo;
    error?: string;
}

export interface AuthResponse {
    user?: User;
    jwtInfo?: JwtInfo;
    error?: string;
}