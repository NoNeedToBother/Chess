import {User} from "../../models/User";
import {JwtInfo} from "../../models/JwtInfo";

export interface AuthResponse {
    user?: User;
    jwtInfo?: JwtInfo;
    error?: string;
}