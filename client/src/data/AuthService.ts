import { LOGIN_ENDPOINT, REGISTER_ENDPOINT } from "../utils/Endpoints";
import axios from 'axios';
import {AuthResponse} from "./model/AuthResponse";

export class AuthService {

    async login(username: String, password: String): Promise<AuthResponse> {
        try {
            let resp = await axios.post<AuthResponse>(
                LOGIN_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            return resp.data
        } catch (e: unknown) {
            return this.handleAxiosError(e)
        }
    }

    async register(username: String, password: String): Promise<AuthResponse> {
        try {
            let resp = await axios.post<AuthResponse>(
                REGISTER_ENDPOINT,
                {
                    "username": username,
                    "password": password
                })
            console.log(resp.data)
            return resp.data
        } catch (e: unknown) {
            return this.handleAxiosError(e)
        }
    }

    handleAxiosError(e: unknown) {
        if (axios.isAxiosError(e)) {
            let error = e.response?.data.error
            if (error !== undefined) return { error: error }
        }
        return { error: "Something went wrong, try again later" }
    }

}