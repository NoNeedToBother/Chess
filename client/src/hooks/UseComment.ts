import {useEffect, useState} from "react";
import {useDataContext} from "../context/DataContext";
import {useUserContext} from "../context/UserContext";
import {Comment} from "../models/Comment";

export interface CommentUploadData {
    postId: number;
    content: string;
}

export function useComment() {
    const { commentService } = useDataContext()
    const { jwt } = useUserContext()

    const [ commentData, setCommentData ] = useState<CommentUploadData | null>(null)
    const [comment, setComment ] = useState<Comment | null>(null)

    const uploadComment = (data: CommentUploadData) => {
        setCommentData(data)
    }

    useEffect(() => {
        if (commentData !== null && jwt !== null) {
            commentService.upload({
                postId: commentData.postId,
                content: commentData.content,
                jwt: jwt
            }).then(res => {
                if (res.comment !== undefined) {
                    setComment(res.comment)
                }
            })
        }
    }, [commentData])

    return { comment, uploadComment }
}