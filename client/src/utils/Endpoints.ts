const DOMAIN_NAME = "http://localhost:8080/api"
const AUTH = "/auth"
const POSTS = "/posts"

export const LOGIN_ENDPOINT = DOMAIN_NAME + AUTH + "/login"
export const REGISTER_ENDPOINT = DOMAIN_NAME + AUTH + "/register"
export const GET_POSTS_ENDPOINT = DOMAIN_NAME + POSTS + "/get/all"
export const GET_POST_ENDPOINT = DOMAIN_NAME + POSTS + "/get"