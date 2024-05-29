import {AbstractService} from "./AbstractService";
import {UrlFormatter} from "../../utils/UrlFormatter";
import {PostMapper} from "../mapper/PostMapper";
import {UserMapper} from "../mapper/UserMapper";
import {UserDataResponse, UserResponse} from "../model/UserResponse";
import axios from "axios";
import {GET_USER_ENDPOINT, GET_USER_POSTS_ENDPOINT, UPDATE_LIKE_ENDPOINT} from "../../utils/Endpoints";
import {PostsDataResponse, PostsResponse} from "../model/PostResponse";
import {Post} from "../../models/Post";

export class UserService extends AbstractService{
    private urlFormatter: UrlFormatter
    private postMapper: PostMapper
    private userMapper: UserMapper

    constructor(urlFormatter: UrlFormatter, postMapper: PostMapper, userMapper: UserMapper) {
        super()
        this.urlFormatter = urlFormatter;
        this.postMapper = postMapper;
        this.userMapper = userMapper;
    }

    async get(id: number, accessToken: string): Promise<UserResponse> {
        return this.handleAxios(async (): Promise<UserResponse> => {
            let params = new Map<string, string>()
            params.set("id", id.toString())
            let resp = await axios.get<UserDataResponse>(
                this.urlFormatter.format(GET_USER_ENDPOINT, params),
                {headers: { Authorization: "Bearer " + accessToken }}
            )
            if (resp.data.user !== undefined && resp.data.isBanned !== undefined && resp.data.isLiked !== undefined) {
                return {user: this.userMapper.map(resp.data.user),
                    isLiked: resp.data.isLiked, isBanned: resp.data.isBanned}
            }
            else return {error: "Something went wrong, try again later"}
        })
    }

    async getPosts(id: number, max: number, accessToken: string): Promise<PostsResponse> {
        return this.handleAxios(async (): Promise<PostsResponse> => {
            let params = new Map<string, string>()
            params.set("id", id.toString())
                .set("amount", max.toString())
            let resp = await axios.get<PostsDataResponse>(
                this.urlFormatter.format(GET_USER_POSTS_ENDPOINT, params),
                {headers: { Authorization: "Bearer " + accessToken }}
            )
            if (resp.data.posts !== undefined) {
                let posts: Post[] = []
                resp.data.posts.forEach((post, _) => {
                    if (post.author !== undefined && post.post !== undefined) {
                        posts.push(this.postMapper.map(post.author, post.post))
                    }
                })
                return {posts: posts}
            } else return {error: "Something went wrong, try again later"}
        })
    }

    async updateLike(id: number, accessToken: string): Promise<UserResponse> {
        return this.handleAxios(async (): Promise<UserResponse> => {
            let params = new Map<string, string>()
            params.set("id", id.toString())
            let resp = await axios.get<UserDataResponse>(
                this.urlFormatter.format(UPDATE_LIKE_ENDPOINT, params),
                {headers: { Authorization: "Bearer " + accessToken }}
            )
            if (resp.data.user !== undefined && resp.data.isBanned !== undefined && resp.data.isLiked !== undefined) {
                return {user: this.userMapper.map(resp.data.user),
                    isLiked: resp.data.isLiked, isBanned: resp.data.isBanned}
            }
            else return {error: "Something went wrong, try again later"}
        })
    }
}