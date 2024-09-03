import { BaseResponse } from "./BaseResponse";
import { User } from "../../models/User";
import { Ban } from "../../models/Ban";

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

export interface UserDataResponse extends BaseResponse {
    user?: UserModelResponse;
    isLiked?: boolean;
    ban?: Ban;
}

export interface UserResponse extends BaseResponse {
    user?: User;
    isLiked?: boolean;
    ban?: Ban;
}

export interface UpdateProfilePictureResponse extends BaseResponse {
    url?: string
}