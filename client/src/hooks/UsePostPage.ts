import {useEffect, useState} from "react";
import {Post} from "../models/Post";
import {useDataContext} from "../context/DataContext";
import {PagePostResponse} from "../data/model/PagePostResponse";
import {useUserContext} from "../context/UserContext";

const PAGE_SIZE = 10

export function usePostPage() {
    const { postService } = useDataContext()
    const { jwt } = useUserContext()

    const [ posts, setPosts ] = useState<Post[] | null>(null)
    const [ page, setPage ] = useState<number | null>(null)
    const [ pageAmount, setPageAmount] = useState<number | undefined>(undefined)

    const getPageAmount = () => {
        if (jwt?.accessToken !== undefined) {
            postService.getPageAmount(PAGE_SIZE, jwt.accessToken)
                .then(res => {
                    setPageAmount(res.pageAmount)
                    }
                )
        }
    }

    const loadPage = (page: number) => {
        setPage(page)
    }

    const checkPosts = (posts: PagePostResponse): Post[] => {
        const res: Post[] = []
        if (posts.posts !== undefined) {
            for (let post of posts.posts) {
                if (post.post !== undefined) {
                    res.push(post.post)
                }
            }
        } return res
    }

    useEffect(() => {
        if (jwt !== null && PAGE_SIZE !== null && page !== null) {
            postService.getAll(page, PAGE_SIZE, jwt.accessToken).then(res =>
                setPosts(checkPosts(res))
            )
        }
    }, [page])

    return { posts, loadPage, pageAmount, getPageAmount }
}