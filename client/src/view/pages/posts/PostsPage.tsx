import React, { useEffect, useState } from "react";
import { PostCard } from "../../components/post/PostCard";
import { Post } from "../../../models/Post";
import { PaginationBar } from "../../components/other/PaginationBar";
import { usePostPage } from "../../../hooks/UsePostPage";
import { useUserContext } from "../../../context/UserContext";
import { checkAuthorityToDeletePost } from "../../../utils/CheckAuthorities";
import { useDataContext } from "../../../context/DataContext";

export function PostsPage() {
    const { user } = useUserContext()
    const { posts, loadPage, pageAmount, getPageAmount, deleteFromPosts } = usePostPage()
    const [ currentPage, setCurrentPage ] = useState<number>(0)
    const { navigator } = useDataContext()

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
        setCurrentPage(page)
        loadPage(page)
    }

    const onUserClick = (id: number) => navigator.navigateToUser(id)
    const onReadMoreClick = (id: number) => navigator.navigateToPost(id)

    const getPost = (post: Post) => {
        if (user !== null) {
            if (checkAuthorityToDeletePost(user, post)) {
                return <PostCard post={ post } key={ post.id }
                                 showDelete={ true } onDelete={ onPostDelete }
                                 onUserClick={ onUserClick }
                                 onReadMoreClick={ onReadMoreClick }
                />
            }
        }
        return <PostCard post={ post } key = { post.id }
                         onUserClick={ onUserClick }
                         onReadMoreClick={ onReadMoreClick }
        />
    }
    const onPostDelete = (id: number) => {
        deleteFromPosts(id, () => {
            loadPage(currentPage)
        })
    }

    return <>
        { posts !== null &&
            <section>
                <div className="py-24 px-8 mx-auto max-w-screen-xl lg:py-32 lg:px-6">
                    <div className="grid gap-8 lg:grid-cols-2">
                        { evenPosts(posts).map((post, _) => getPost(post)) }
                    </div>
                    { posts.length % 2 === 1 &&
                        <div className="lg:px-40 md:px-20 gap-8 py-8 grid grid-cols-1">
                            { getPost(posts[posts.length - 1]) }
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