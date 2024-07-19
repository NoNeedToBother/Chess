import {AbstractService} from "./AbstractService";
import {UrlFormatter} from "../../utils/UrlFormatter";
import axios from "axios";
import {CommentDataResponse, CommentResponse} from "../model/CommentResponse";
import {UPLOAD_COMMENT_ENDPOINT} from "../../utils/Endpoints";
import {CommentMapper} from "../mapper/CommentMapper";

export interface UploadCommentRequest {
    postId: number;
    content: string;
    token: string
}

export class CommentService extends AbstractService{
    private urlFormatter: UrlFormatter
    private commentMapper: CommentMapper

    constructor(urlFormatter: UrlFormatter, commentMapper: CommentMapper) {
        super()
        this.urlFormatter = urlFormatter
        this.commentMapper = commentMapper
    }

    async upload({postId, content, token}: UploadCommentRequest): Promise<CommentResponse> {
        return this.handleAxios( async (localToken = token) => {
            let resp = await axios.post<CommentDataResponse>(
                UPLOAD_COMMENT_ENDPOINT,
                {postId: postId, content: content},
                {headers: { Authorization: "Bearer " + localToken }}
            )
            if (resp.data.comment !== undefined && resp.data.author !== undefined) {
                return {comment: this.commentMapper.map(resp.data.author, resp.data.comment)}
            } else return {error: "Something went wrong, try again later"}
        })
    }
}