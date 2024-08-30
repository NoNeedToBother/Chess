import { CommentModelResponse } from "../model/CommentResponse";
import { Comment } from "../../models/Comment";
import { UserModelResponse } from "../model/UserResponse";
import { UserMapper } from "./UserMapper";

export class CommentMapper {
    private userMapper: UserMapper

    constructor(userMapper: UserMapper) {
        this.userMapper = userMapper
    }

    map(user: UserModelResponse, comment: CommentModelResponse): Comment {
        return {
            id: comment.id,
            author: this.userMapper.map(user),
            datePublished: comment.datePublished,
            content: comment.content,
            rating: comment.rating,
        }
    }

}