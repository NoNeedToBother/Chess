import {BaseResponse} from "./BaseResponse";
import {User} from "../../models/User";

export interface UserModelResponse {
    id: number;
    username: string;
    name: string | null;
    lastname: string | null;
    profilePicture: string;
    bio: string | null;
    dateRegistered: string;
    likes: number;
    roles: string[]
}

export interface UserDataResponse extends BaseResponse{
    user?: UserModelResponse;
    isLiked?: boolean;
    isBanned?: boolean;
}

export interface UserResponse extends BaseResponse{
    user?: User;
    isLiked?: boolean;
    isBanned?: boolean;
}