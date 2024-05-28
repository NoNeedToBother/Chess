import axios from "axios";
import {
    GET_POST_ENDPOINT,
    GET_POST_PAGE_AMOUNT_ENDPOINT,
    GET_POSTS_ENDPOINT,
    UPDATE_POST_RATING_ENDPOINT
} from "../../utils/Endpoints";
import {UrlFormatter} from "../../utils/UrlFormatter";
import {PageAmountResponse, PagePostDataResponse, PagePostResponse} from "../model/PagePostResponse";
import {PostDataResponse, PostModelResponse, PostResponse} from "../model/PostResponse";
import {UserMapper} from "../mapper/UserMapper";
import {UserModelResponse} from "../model/UserModelResponse";
import {AbstractService} from "./AbstractService";

export class PostService extends AbstractService{
    private urlFormatter: UrlFormatter
    private userMapper: UserMapper

    constructor(urlFormatter: UrlFormatter, userMapper: UserMapper) {
        super()
        this.urlFormatter = urlFormatter
        this.userMapper = userMapper
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
                        posts.push(this.mapPostDataResponse(post.author, post.post))
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
                return this.mapPostDataResponse(resp.data.author, resp.data.post)
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
                return this.mapPostDataResponse(resp.data.author, resp.data.post)
            else return { error: "Something went wrong, try again later"}
        })
    }

    private mapPostDataResponse(user: UserModelResponse, post: PostModelResponse): PostResponse {
        return {
            post: {
                id: post.id,
                author: this.userMapper.map(user),
                imageUrl: post.imageUrl,
                title: post.title,
                content: post.content,
                description: post.description,
                datePosted: post.datePosted,
                rating: post.rating,
            }
        }
    }
}