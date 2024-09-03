import { AbstractService } from "./AbstractService";
import { UrlFormatter } from "../../utils/UrlFormatter";
import { PostMapper } from "../mapper/PostMapper";
import { UserMapper } from "../mapper/UserMapper";
import { UpdateProfilePictureResponse, UserDataResponse, UserResponse } from "../model/UserResponse";
import axios from "axios";
import {
    BAN_USER_ADMIN_ENDPOINT, BAN_USER_MODERATOR_ENDPOINT,
    GET_USER_ENDPOINT,
    GET_USER_POSTS_ENDPOINT, UNBAN_USER_ADMIN_ENDPOINT, UNBAN_USER_MODERATOR_ENDPOINT,
    UPDATE_LIKE_ENDPOINT, UPDATE_PROFILE_INFO_ENDPOINT, UPDATE_PROFILE_PICTURE_ENDPOINT
} from "../../utils/Endpoints";
import { PostsDataResponse, PostsResponse } from "../model/PostResponse";
import { Post } from "../../models/Post";
import { JwtInfo } from "../../models/JwtInfo";
import { BanDataResponse, BanResponse } from "../model/BanResponse";
import { User } from "../../models/User";
import { Role } from "../../models/Role";
import { BaseResponse } from "../model/BaseResponse";

export interface BanRequest {
    from: User
    bannedId: number
    reason: String
}

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

    async get(id: number, jwt: JwtInfo): Promise<UserResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<UserResponse> => {
            const params = new Map<string, string>()
            params.set("id", id.toString())
            const resp = await axios.get<UserDataResponse>(
                this.urlFormatter.format(GET_USER_ENDPOINT, params),
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return this.extractUserData(resp.data)
        }, jwt)
    }

    async getPosts(id: number, max: number, jwt: JwtInfo): Promise<PostsResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<PostsResponse> => {
            const params = new Map<string, string>()
            params.set("id", id.toString())
                .set("amount", max.toString())
            const resp = await axios.get<PostsDataResponse>(
                this.urlFormatter.format(GET_USER_POSTS_ENDPOINT, params),
                { headers: { Authorization: "Bearer " + localToken } }
            )
            if (resp.data.posts !== undefined) {
                const posts: Post[] = []
                resp.data.posts.forEach((post, _) => {
                    if (post.author !== undefined && post.post !== undefined) {
                        posts.push(this.postMapper.map(post.author, post.post))
                    }
                })
                return { posts: posts }
            } else return { error: "Something went wrong, try again later" }
        }, jwt)
    }

    async updateLike(id: number, jwt: JwtInfo): Promise<UserResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<UserResponse> => {
            const params = new Map<string, string>()
            params.set("id", id.toString())
            const resp = await axios.get<UserDataResponse>(
                this.urlFormatter.format(UPDATE_LIKE_ENDPOINT, params),
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return this.extractUserData(resp.data)
        }, jwt)
    }

    async ban(request: BanRequest, jwt: JwtInfo): Promise<BanResponse> {
        let url: string
        if (request.from.roles.includes(Role.CHIEF_ADMIN) || request.from.roles.includes(Role.ADMIN))
            url = BAN_USER_ADMIN_ENDPOINT
        else if (request.from.roles.includes(Role.MODERATOR))
            url = BAN_USER_MODERATOR_ENDPOINT
        else return { error: "Not enough authorities" }
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<BanResponse> => {
            const resp = await axios.post<BanDataResponse>(
                url,
                { bannedId: request.bannedId, reason: request.reason },
                { headers: { Authorization: "Bearer " + localToken } }
            )
            if (resp.data.userData !== undefined) return { user: this.extractUserData(resp.data) }
            else if (resp.data.error !== undefined) return { error: resp.data.error }
            else return { error: "Something went wrong, try again later"}
        }, jwt)
    }

    async unban(from: User, bannedId: number, jwt: JwtInfo): Promise<BaseResponse> {
        let url: string
        if (from.roles.includes(Role.CHIEF_ADMIN) || from.roles.includes(Role.ADMIN))
            url = UNBAN_USER_ADMIN_ENDPOINT
        else if (from.roles.includes(Role.MODERATOR))
            url = UNBAN_USER_MODERATOR_ENDPOINT
        else return { error: "Not enough authorities" }


        return this.handleAxios(async (localToken = jwt.accessToken): Promise<BaseResponse> => {
            const params = new Map<string, string>()
            params.set("id", bannedId.toString())
            const resp = await axios.get<BaseResponse>(
                this.urlFormatter.format(url, params),
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return resp.data
        }, jwt)
    }

    async updateProfilePicture(image: File, jwt: JwtInfo): Promise<UpdateProfilePictureResponse> {
        const formData = new FormData()
        formData.append("image", image)
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<UpdateProfilePictureResponse> => {
            const resp = await axios.post<UpdateProfilePictureResponse>(
                UPDATE_PROFILE_PICTURE_ENDPOINT,
                formData,
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return resp.data
        }, jwt)
    }

    async updateProfileInfo(name: string | undefined, lastname: string | undefined, bio: string | undefined,
                            jwt: JwtInfo): Promise<UserResponse> {
        return this.handleAxios(async (localToken = jwt.accessToken): Promise<UserResponse> => {
            const resp = await axios.post<UserResponse>(
                UPDATE_PROFILE_INFO_ENDPOINT,
                { name, lastname, bio },
                { headers: { Authorization: "Bearer " + localToken } }
            )
            return resp.data
        }, jwt)
    }

    private extractUserData(data: UserDataResponse): UserResponse {
        if (data.user !== undefined && data.isLiked !== undefined) {
            if (data.ban !== undefined)
                return { user: this.userMapper.map(data.user), isLiked: data.isLiked, ban: data.ban }
            else return { user: this.userMapper.map(data.user), isLiked: data.isLiked }
        }
        else return { error: "Something went wrong, try again later" }
    }
}