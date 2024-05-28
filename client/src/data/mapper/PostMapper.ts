import {UserMapper} from "./UserMapper";
import {UserModelResponse} from "../model/UserModelResponse";
import {PostModelResponse} from "../model/PostResponse";
import {Post} from "../../models/Post";

export class PostMapper {
    private userMapper: UserMapper;

    constructor(userMapper: UserMapper) {
        this.userMapper = userMapper;
    }

    map(author: UserModelResponse, post: PostModelResponse): Post {
        return {
            id: post.id,
            author: this.userMapper.map(author),
            imageUrl: post.imageUrl,
            title: post.title,
            content: post.content,
            description: post.description,
            datePosted: post.datePosted,
            rating: post.rating,
        }
    }
}