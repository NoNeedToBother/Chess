import React from "react";
import {useDataContext} from "../../../context/DataContext";
import {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {Post} from "../../../models/Post";
import {useUserContext} from "../../../context/UserContext";

export function PostPage() {
    const { postService } = useDataContext()
    const { id } = useParams()
    const [post, setPost ] = useState<Post | null>(null)
    const { jwt } = useUserContext()

    useEffect(() => {
        let token = jwt?.accessToken
        if (token !== undefined && id !== undefined) {
            postService.get(parseInt(id), token).then(res => {
                    if (res.post !== undefined) {
                        setPost(res.post)
                    }
                }
            )
        }
    }, [])

    return (
        <>
            {post !== null &&
                <div>
                    { post.content }
                </div>
            }
        </>
    )
}