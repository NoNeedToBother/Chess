import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "../utils/Endpoints";
import axios from 'axios';
import {AuthDataResponse, AuthResponse} from "./model/AuthResponse";
import {UserMapper} from "./mapper/UserMapper";

export class AuthService {

    private userMapper: UserMapper

    constructor(userMapper: UserMapper) {
        this.userMapper = userMapper
    }

    async login(username: String, password: String): Promise<AuthResponse> {
        try {
            let resp = await axios.post<AuthDataResponse>(
                LOGIN_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            return this.mapDataResponse(resp.data)
        } catch (e: unknown) {
            return this.handleAxiosError(e)
        }
    }

    async register(username: String, password: String): Promise<AuthResponse> {
        try {
            let resp = await axios.post<AuthDataResponse>(
                REGISTER_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            return this.mapDataResponse(resp.data)
        } catch (e: unknown) {
            return this.handleAxiosError(e)
        }
    }

    private handleAxiosError(e: unknown) {
        if (axios.isAxiosError(e)) {
            let error = e.response?.data.error
            if (error !== undefined) return { error: error }
        }
        return { error: "Something went wrong, try again later" }
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