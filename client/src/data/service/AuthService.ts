import {LOGIN_ENDPOINT, REGISTER_ENDPOINT} from "../../utils/Endpoints";
import axios from 'axios';
import {AuthDataResponse, AuthResponse} from "../model/AuthResponse";
import {UserMapper} from "../mapper/UserMapper";
import {AbstractService} from "./AbstractService";

export class AuthService extends AbstractService {

    private userMapper: UserMapper

    constructor(userMapper: UserMapper) {
        super()
        this.userMapper = userMapper
    }

    async login(username: String, password: String): Promise<AuthResponse> {
        return this.handleAxios( async () => {
            let resp = await axios.post<AuthDataResponse>(
                LOGIN_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            return this.mapDataResponse(resp.data)
        })
    }

    async register(username: String, password: String): Promise<AuthResponse> {
        return this.handleAxios( async () => {
            let resp = await axios.post<AuthDataResponse>(
                REGISTER_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            return this.mapDataResponse(resp.data)
        })
    }

    private mapDataResponse(resp: AuthDataResponse): AuthResponse {
        if (resp.user !== undefined && resp.jwtInfo !== undefined) {
            return {
                user: this.userMapper.map(resp.user),
                jwtInfo: resp.jwtInfo
            }
        }
        else if (!resp.error) return { error: resp.error }
        else return {error: "Something went wrong, try again later"}
    }
}