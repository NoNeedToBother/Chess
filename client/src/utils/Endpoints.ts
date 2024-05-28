const DOMAIN_NAME = "http://localhost:8080/api"
const AUTH = "/auth"
const POSTS = "/posts"
const COMMENTS = "/comments"

export const LOGIN_ENDPOINT = DOMAIN_NAME + AUTH + "/login"
export const REGISTER_ENDPOINT = DOMAIN_NAME + AUTH + "/register"
export const GET_POSTS_ENDPOINT = DOMAIN_NAME + POSTS + "/get/all"
export const GET_POST_ENDPOINT = DOMAIN_NAME + POSTS + "/get"
export const GET_POST_PAGE_AMOUNT_ENDPOINT = DOMAIN_NAME + POSTS + "/get/pageamount"
export const UPDATE_POST_RATING_ENDPOINT = DOMAIN_NAME + POSTS + "/update/rating"
export const GET_COMMENTS_ENDPOINT = DOMAIN_NAME + POSTS + "/get/comments"
export const UPLOAD_COMMENT_ENDPOINT = DOMAIN_NAME + COMMENTS + "/upload"