import React, {useEffect, useState} from "react";
import {PostCard} from "../../components/PostCard";
import {Post} from "../../../models/Post";
import {PaginationBar} from "../../components/other/PaginationBar";
import {useLoadPostPage} from "../../../hooks/UseLoadPostPage";
import {useDataContext} from "../../../context/DataContext";
import {useUserContext} from "../../../context/UserContext";

const PAGE_SIZE = 10

export function PostsPage() {
    const { postService } = useDataContext()
    const { jwt } = useUserContext()

    const {posts, loadPage} = useLoadPostPage()
    const [ pageAmount, setPageAmount] = useState<number | undefined>(undefined)

    useEffect(() => {
        if (jwt?.accessToken !== undefined) {
            postService
                .getPageAmount(PAGE_SIZE, jwt.accessToken)
                .then(res => setPageAmount(res.pageAmount)
            )
        }
    }, []);

    useEffect(() => {
        if (jwt?.accessToken !== undefined)
            loadPage(0, PAGE_SIZE, jwt.accessToken)
    }, []);

    const evenPosts = (posts: Post[]) => {
        if (posts.length % 2 === 1)
            return posts.slice(0, posts.length - 1)
        else return posts
    }

    const onPageChanged = (page: number) => {
        if (jwt?.accessToken !== undefined)
            loadPage(page, PAGE_SIZE, jwt.accessToken)
    }

    return <>
        {posts !== null && posts !== undefined &&
            <section className="bg-white dark:bg-gray-900">
                <div className="py-24 px-8 mx-auto max-w-screen-xl lg:py-32 lg:px-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                        { evenPosts(posts).map((post, _) =>
                            <PostCard post={ post } onProfilePictureClick={ () => {}} key={ post.id } />)}
                    </div>
                    {posts.length % 2 === 1 &&
                        <div className="lg:px-40 md:px-20 grid grid-cols-1">
                            <PostCard post={ posts[posts.length - 1] } onProfilePictureClick={ () => {}}
                                      key={ posts[posts.length - 1].id }/>
                        </div>
                    }
                </div>
                { pageAmount !== undefined &&
                    <div className="absolute py-8 lg:px-32 md:px-16 w-full flex items-center justify-center">
                        <PaginationBar pageAmount={pageAmount} onPageChanged={ onPageChanged }/>
                    </div>
                }
            </section>
        }
    </>
}