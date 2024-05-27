import React, {useEffect, useState} from "react";
import {useDataContext} from "../../../context/DataContext";
import {useUserContext} from "../../../context/UserContext";
import {PagePostResponse} from "../../../data/model/PagePostResponse";
import {PostCard} from "../../components/PostCard";

export function PostsPage() {
    const { postService, navigator } = useDataContext()
    const [posts, setPosts ] = useState<PagePostResponse | null>(null)
    const { jwt } = useUserContext()

    useEffect(() => {
        let token = jwt?.accessToken
        if (token !== undefined) {
            postService.getAll(0, token).then(res =>
                setPosts(res)
            )
        }
    }, [])

    return <>
        {posts !== null && posts.posts !== undefined &&
            <section className="bg-white dark:bg-gray-900">
                <div className="py-16 px-4 mx-auto max-w-screen-xl lg:py-32 lg:px-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                        { posts.posts.map((post, i) =>
                                <PostCard post={ post.post! } onProfilePictureClick={ () => {}}/>)}
                    </div>
                </div>
            </section>
        }
    </>
}