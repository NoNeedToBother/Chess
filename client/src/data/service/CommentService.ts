import {AbstractService} from "./AbstractService";
import axios from "axios";
import {CommentDataResponse, CommentResponse} from "../model/CommentResponse";
import {UPLOAD_COMMENT_ENDPOINT} from "../../utils/Endpoints";
import {CommentMapper} from "../mapper/CommentMapper";
import {JwtInfo} from "../../models/JwtInfo";

export interface UploadCommentRequest {
    postId: number;
    content: string;
    jwt: JwtInfo
}

export class CommentService extends AbstractService{
    private commentMapper: CommentMapper

    constructor(commentMapper: CommentMapper) {
        super()
        this.commentMapper = commentMapper
    }

    async upload({postId, content, jwt}: UploadCommentRequest): Promise<CommentResponse> {
        return this.handleAxios( async (localToken = jwt.accessToken) => {
            let resp = await axios.post<CommentDataResponse>(
                UPLOAD_COMMENT_ENDPOINT,
                {postId: postId, content: content},
                {headers: { Authorization: "Bearer " + localToken }}
            )
            if (resp.data.comment !== undefined && resp.data.author !== undefined) {
                return {comment: this.commentMapper.map(resp.data.author, resp.data.comment)}
            } else return {error: "Something went wrong, try again later"}
        }, jwt)
    }
}