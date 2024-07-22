import {useUserContext} from "../context/UserContext";
import {useEffect, useState} from "react";
import {Post} from "../models/Post";
import {useDataContext} from "../context/DataContext";
import {Comment} from "../models/Comment";

export interface PostUploadData {
    title: string;
    content: string;
    description: string;
}

export function usePost(id: string | undefined) {
    const { postService } = useDataContext()
    const { jwt } = useUserContext()

    const [ post, setPost ] = useState<Post | null>(null)
    const [ rating, setRating ] = useState(-1)
    const [ comments, setComments ] = useState<Comment[]>([])

    const updateRating = (rating: number) => {
        setRating(rating)
    }
    const addComment = (comment: Comment) => {
        setComments(prev => [comment, ...prev])
    }
    const deletePost = (onDeleted: () => void) => {
        if (jwt !== null && id !== undefined) {
            postService.delete(parseInt(id), jwt)
                .then((res) => {
                    if (res.error === undefined) onDeleted()
            })
        }
    }

    useEffect(() => {
        if (jwt !== null && id !== undefined) {
            postService.get(parseInt(id), jwt).then(res => {
                    if (res.post !== undefined) setPost(res.post)
                }
            )
        }
    }, [])

    async function sendUpdateRatingRequest(rating: number) {
        if (jwt !== null && id !== undefined) {
            const post = await postService.updateRating(parseInt(id), rating, jwt)
            if (post.post !== undefined) setPost(post.post)
        }
    }

    useEffect(() => {
        if (rating !== -1) {
            sendUpdateRatingRequest(rating)
        }
    }, [rating]);

    useEffect(() => {
        if (jwt !== null && id !== undefined) {
            postService.getComments(parseInt(id), jwt).then(res => {
                if (res.comments !== undefined) setComments(res.comments)
            })
        }
    }, []);

    return { post, comments, updateRating, addComment, deletePost }
}