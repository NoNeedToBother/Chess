import axios from "axios";
import {
    DELETE_POST_ENDPOINT,
    GET_COMMENTS_ENDPOINT,
    GET_POST_ENDPOINT,
    GET_POST_PAGE_AMOUNT_ENDPOINT,
    GET_POSTS_ENDPOINT,
    UPDATE_POST_RATING_ENDPOINT, UPLOAD_POST_ENDPOINT
} from "../../utils/Endpoints";
import {UrlFormatter} from "../../utils/UrlFormatter";
import {PageAmountResponse, PagePostDataResponse, PagePostResponse} from "../model/PagePostResponse";
import {PostDataResponse, PostResponse} from "../model/PostResponse";
import {AbstractService} from "./AbstractService";
import {CommentsDataResponse, CommentsResponse} from "../model/CommentResponse";
import {Comment} from "../../models/Comment";
import {PostMapper} from "../mapper/PostMapper";
import {CommentMapper} from "../mapper/CommentMapper";
import {BaseResponse} from "../model/BaseResponse";


export interface UploadPostRequest {
    title: string
    content: string
    description: string
    token: string
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

    async getAll(page: number, pageSize: number, accessToken: string): Promise<PagePostResponse> {
        return this.handleAxios(async () => {
            let params = new Map<string, string>()
            params.set("page", page.toString())
                .set("size", pageSize.toString())
            let resp = await axios.get<PagePostDataResponse>(
                this.urlFormatter.format(
                    GET_POSTS_ENDPOINT, params),
                {
                    headers: { Authorization: "Bearer " + accessToken }
                })
            let posts: PostResponse[] = []

            if (resp.data.content !== undefined) {
                resp.data.content.forEach( post => {
                    if (post.author !== undefined && post.post !== undefined)
                        posts.push({
                            post: this.postMapper.map(post.author, post.post)
                        })
                })
            }
            return {posts: posts} as PagePostResponse
        })
    }

    async get(id: number, accessToken: string): Promise<PostResponse> {
        return this.handleAxios(async () => {
            let params = new Map<string, string>()
            params.set("id", id.toString())
            let resp = await axios.get<PostDataResponse>(
                this.urlFormatter.format(GET_POST_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + accessToken}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined)
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            else return { error: "Something went wrong, try again later"}
        })
    }

    async getPageAmount(pageSize: number, accessToken: string): Promise<PageAmountResponse> {
        return this.handleAxios(async () => {
            let params = new Map<string, string>()
            params.set("size", pageSize.toString())
            let resp = await axios.get<PageAmountResponse>(
                this.urlFormatter.format(GET_POST_PAGE_AMOUNT_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + accessToken}}
            )
            return resp.data
        })
    }

    async updateRating(postId: number, rating: number, accessToken: string): Promise<PostResponse> {
        return this.handleAxios(async () => {
            let resp = await axios.post<PostDataResponse>(
                UPDATE_POST_RATING_ENDPOINT,
                {postId: postId, rating: rating},
                { headers: {Authorization: "Bearer " + accessToken}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined)
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            else return { error: "Something went wrong, try again later"}
        })
    }

    async getComments(postId: number, accessToken: string): Promise<CommentsResponse> {
        let params = new Map<string, string>()
        params.set("id", postId.toString())
        return this.handleAxios(async () => {
            let resp = await axios.get<CommentsDataResponse>(
                this.urlFormatter.format(GET_COMMENTS_ENDPOINT, params),
                { headers: {Authorization: "Bearer " + accessToken}}
            )
            if (resp.data.comments !== undefined) {
                let comments: Comment[] = []
                resp.data.comments.forEach( (obj, _) => {
                    if (obj.comment !== undefined && obj.author !== undefined) {
                        comments.push(this.commentMapper.map(obj.author, obj.comment))
                    }
                })
                return {comments: comments}
            } else return { error: "Something went wrong, try again later"}
        })
    }

    async upload({title, content, description, token, image}: UploadPostRequest): Promise<PostResponse> {
        let formData = new FormData()
        formData.append("title", title.toString())
        formData.append("content", content.toString())
        formData.append("description", description.toString())
        formData.append("image", image)
        return this.handleAxios(async () => {
            let resp = await axios.post<PostDataResponse>(
                UPLOAD_POST_ENDPOINT,
                formData,
                { "headers": {"Authorization": "Bearer " + token}}
            )
            if (resp.data.post !== undefined && resp.data.author !== undefined) {
                return {post: this.postMapper.map(resp.data.author, resp.data.post)}
            } else return { error: "Something went wrong, try again later"}
        })
    }

    async delete(id: number, accessToken: string): Promise<BaseResponse> {
        let params = new Map<string, string>()
        params.set("id", id.toString())
        return this.handleAxios(async (): Promise<BaseResponse> => {
            let resp = await axios.post<BaseResponse>(
                this.urlFormatter.format(DELETE_POST_ENDPOINT, params),
                {},
                { "headers": {"Authorization": "Bearer " + accessToken}}
            )
            return resp.data
        })
    }
}