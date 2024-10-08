const DOMAIN_NAME = "http://localhost:8080/api"

const AUTH = "/auth"
const POSTS = "/posts"
const COMMENTS = "/comments"
const USERS = "/users"
const PUZZLES = "/puzzle"

export const LOGIN_ENDPOINT = DOMAIN_NAME + AUTH + "/login"
export const REGISTER_ENDPOINT = DOMAIN_NAME + AUTH + "/register"
export const REFRESH_TOKEN_ENDPOINT = DOMAIN_NAME + AUTH + "/refresh"

export const GET_POSTS_ENDPOINT = DOMAIN_NAME + POSTS + "/get/all"
export const GET_POST_ENDPOINT = DOMAIN_NAME + POSTS + "/get"
export const GET_POST_PAGE_AMOUNT_ENDPOINT = DOMAIN_NAME + POSTS + "/get/pageamount"
export const UPDATE_POST_RATING_ENDPOINT = DOMAIN_NAME + POSTS + "/update/rating"
export const GET_COMMENTS_ENDPOINT = DOMAIN_NAME + POSTS + "/get/comments"
export const UPLOAD_COMMENT_ENDPOINT = DOMAIN_NAME + COMMENTS + "/upload"
export const UPLOAD_POST_ENDPOINT = DOMAIN_NAME + POSTS + "/upload"
export const DELETE_POST_ENDPOINT = DOMAIN_NAME + POSTS + "/delete"

export const GET_USER_ENDPOINT = DOMAIN_NAME + USERS + "/get"
export const GET_USER_POSTS_ENDPOINT = DOMAIN_NAME + USERS + "/get/posts"
export const UPDATE_LIKE_ENDPOINT = DOMAIN_NAME + USERS + "/update/like"
export const UPDATE_PROFILE_PICTURE_ENDPOINT = DOMAIN_NAME + USERS + "/update/profile/picture"
export const UPDATE_PROFILE_INFO_ENDPOINT = DOMAIN_NAME + USERS + "/update/profile/info"

export const BAN_USER_MODERATOR_ENDPOINT = DOMAIN_NAME + USERS + "/moderator/ban"
export const BAN_USER_ADMIN_ENDPOINT = DOMAIN_NAME + USERS + "/admin/ban"
export const UNBAN_USER_MODERATOR_ENDPOINT = DOMAIN_NAME + USERS + "/moderator/unban"
export const UNBAN_USER_ADMIN_ENDPOINT = DOMAIN_NAME + USERS + "/admin/unban"

export const GET_DAILY_PUZZLE_ENDPOINT = DOMAIN_NAME + PUZZLES + "/get/daily"
