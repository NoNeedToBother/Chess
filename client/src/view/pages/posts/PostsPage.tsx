import React, {useEffect, useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import {useUserContext} from "../../../context/UserContext";
import {PagePostResponse} from "../../../data/model/PagePostResponse";

export function PostsPage() {
    const { postService } = useDataContext()
    const [posts, setPosts ] = useState<PagePostResponse | null>(null)
    const { jwt } = useUserContext()

    useEffect(() => {
        let token = jwt?.accessToken
        if (token !== undefined) {
            postService.getAll(0, token).then(res => setPosts(res)
            )
        }
    }, [])

    return <></>
}