import { UserModelResponse } from "./UserResponse";
import { BaseResponse } from "./BaseResponse";
import { Comment } from "../../models/Comment";

export interface CommentResponse extends BaseResponse {
    comment?: Comment
}

export interface CommentsResponse extends BaseResponse {
    comments?: Comment[]
}

export interface CommentsDataResponse extends BaseResponse {
    comments?: CommentDataResponse[]
}

export interface CommentDataResponse extends BaseResponse {
    comment?: CommentModelResponse;
    author?: UserModelResponse;
}

export interface CommentModelResponse {
    id: number;
    authorId: number;
    datePublished: string;
    content: string;
    rating: number;
}