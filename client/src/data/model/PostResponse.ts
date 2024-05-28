import {UserModelResponse} from "./UserModelResponse";
import {Post} from "../../models/Post";
import {BaseResponse} from "./BaseResponse";

export interface PostDataResponse extends BaseResponse{
    author?: UserModelResponse
    post?: PostModelResponse
}

export interface PostResponse extends BaseResponse{
    post?: Post;
}

export interface PostModelResponse {
    id: number;
    authorId: number;
    imageUrl: string;
    title: string;
    content: string;
    description: string;
    datePosted: string;
    rating: number;
}