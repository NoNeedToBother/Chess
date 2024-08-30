import axios from "axios";
import {
    DELETE_POST_ENDPOINT,
    GET_COMMENTS_ENDPOINT,
    GET_POST_ENDPOINT,
    GET_POST_PAGE_AMOUNT_ENDPOINT,
    GET_POSTS_ENDPOINT,
    UPDATE_POST_RATING_ENDPOINT,
    UPLOAD_POST_ENDPOINT
} from "../../utils/Endpoints";
import { UrlFormatter } from "../../utils/UrlFormatter";
import { PageAmountResponse, PagePostDataResponse, PagePostResponse } from "../model/PagePostResponse";
import { PostDataResponse, PostResponse } from "../model/PostResponse";
import { AbstractService } from "./AbstractService";
import { CommentsDataResponse, CommentsResponse } from "../model/CommentResponse";
import { Comment } from "../../models/Comment";
import { PostMapper } from "../mapper/PostMapper";
import { CommentMapper } from "../mapper/CommentMapper";
import { BaseResponse } from "../model/BaseResponse";
import { JwtInfo } from "../../models/JwtInfo";

export interface UploadPostRequest {
    title: string
    content: string
    description: string
    jwt: JwtInfo
    image: File
}

export class PostService extends AbstractService{
    private urlFormatter: UrlFormatter
    private postMapper: PostMapper
    private commentMapper: CommentMapper

    constructor(urlFormatter: UrlFormatter, postMapper: PostMapper, commentMapper: CommentMapper) {
        super()
        this.urlFormatter = urlFormatter
        this.postMapper = postMapper
        this.commentMapper = commentMapper
    }

    async getAll(page: number, pageSize: number, jwt: JwtInfo): Promise<PagePostResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const params = new Map<string, string>()
            params.set("page", page.toString())
                .set("size", pageSize.toString())
            const resp = await axios.get<PagePostDataResponse>(
                this.urlFormatter.format(
                    GET_POSTS_ENDPOINT, params),
                {
                    headers: { Authorization: "Bearer " + localToken }
                })
            const posts: PostResponse[] = []

            if (resp.data.content !== undefined) {
                resp.data.content.forEach( post => {
                    if (post.author !== undefined && post.post !== undefined)
                        posts.push({
                            post: this.postMapper.map(post.author, post.post)
                        })
                })
            }
            return {posts: posts} as PagePostResponse
        }, jwt)
    }

    async get(id: number, jwt: JwtInfo): Promise<PostResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const params = new Map<string, string>()
            params.set("id", id.toString())
            const resp = await axios.get<PostDataResponse>(
                this.urlFormatter.format(GET_POST_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + localToken}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined)
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            else return { error: "Something went wrong, try again later"}
        }, jwt)
    }

    async getPageAmount(pageSize: number, jwt: JwtInfo): Promise<PageAmountResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const params = new Map<string, string>()
            params.set("size", pageSize.toString())
            const resp = await axios.get<PageAmountResponse>(
                this.urlFormatter.format(GET_POST_PAGE_AMOUNT_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + localToken}}
            )
            return resp.data
        }, jwt)
    }

    async updateRating(postId: number, rating: number, jwt: JwtInfo): Promise<PostResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const resp = await axios.post<PostDataResponse>(
                UPDATE_POST_RATING_ENDPOINT,
                {postId: postId, rating: rating},
                { headers: {Authorization: "Bearer " + localToken}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined)
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            else return { error: "Something went wrong, try again later"}
        }, jwt)
    }

    async getComments(postId: number, jwt: JwtInfo): Promise<CommentsResponse> {
        const params = new Map<string, string>()
        params.set("id", postId.toString())
        return this.handleAxios(async () => {
            const resp = await axios.get<CommentsDataResponse>(
                this.urlFormatter.format(GET_COMMENTS_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + jwt.accessToken}}
            )
            if (resp.data.comments !== undefined) {
                const comments: Comment[] = []
                resp.data.comments.forEach( (obj, _) => {
                    if (obj.comment !== undefined && obj.author !== undefined) {
                        comments.push(this.commentMapper.map(obj.author, obj.comment))
                    }
                })
                return {comments: comments}
            } else return { error: "Something went wrong, try again later"}
        }, jwt)
    }

    async upload({title, content, description, jwt, image}: UploadPostRequest): Promise<PostResponse> {
        const formData = new FormData()
        formData.append("title", title.toString())
        formData.append("content", content.toString())
        formData.append("description", description.toString())
        formData.append("image", image)
        return this.handleAxios(async (localToken = jwt.accessToken) => {
            const resp = await axios.post<PostDataResponse>(
                UPLOAD_POST_ENDPOINT,
                formData,
                { "headers": {"Authorization": "Bearer " + localToken}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined) {
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            } else return { error: "Something went wrong, try again later"}
        }, jwt)
    }

    async delete(id: number, jwt: JwtInfo): Promise<BaseResponse> {
        const params = new Map<string, string>()
        params.set("id", id.toString())
        return this.handleAxios(async (): Promise<BaseResponse> => {
            const resp = await axios.post<BaseResponse>(
                this.urlFormatter.format(DELETE_POST_ENDPOINT, params),
                {},
                { "headers": {"Authorization": "Bearer " + jwt.accessToken}}
            )
            return resp.data
        }, jwt)
    }
}