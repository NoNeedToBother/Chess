import React, {useEffect} from "react";
import {PostCard} from "../../components/post/PostCard";
import {Post} from "../../../models/Post";
import {PaginationBar} from "../../components/other/PaginationBar";
import {usePostPage} from "../../../hooks/UsePostPage";

export function PostsPage() {
    const {posts, loadPage, pageAmount, getPageAmount} = usePostPage()

    useEffect(() => {
        loadPage(0)
    }, []);

    useEffect(() => {
        getPageAmount()
    }, []);

    const evenPosts = (posts: Post[]) => {
        if (posts.length % 2 === 1)
            return posts.slice(0, posts.length - 1)
        else return posts
    }

    const onPageChanged = (page: number) => {
        loadPage(page)
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
                        <div className="lg:px-40 md:px-20 gap-8 py-8 grid grid-cols-1">
                            <PostCard post={ posts[posts.length - 1] } onProfilePictureClick={ () => {}}
                                      key={ posts[posts.length - 1].id }/>
                        </div>
                    }
                </div>
                { pageAmount !== undefined &&
                    <div className="absolute py-8 lg:px-32 md:px-16 w-full flex items-center justify-center">
                        <PaginationBar pageAmount={ pageAmount } onPageChanged={ onPageChanged }/>
                    </div>
                }
            </section>
        }
    </>
}