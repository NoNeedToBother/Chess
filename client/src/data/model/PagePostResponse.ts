import {PostDataResponse, PostResponse} from "./PostResponse";
import {BaseResponse} from "./BaseResponse";

export interface PagePostDataResponse extends BaseResponse{
    content?: PostDataResponse[]
}

export interface PagePostResponse extends BaseResponse {
    posts?: PostResponse[]
}