import { LOGIN_ENDPOINT } from "../utils/Endpoints";
import axios from 'axios';
import {AuthResponse} from "./model/AuthResponse";

export class AuthService {

    async login(username: String, password: String): Promise<AuthResponse> {
        let resp = await axios.post<AuthResponse>(LOGIN_ENDPOINT, {
            "username": username,
            "password": password
        })
        return resp.data
    }

}