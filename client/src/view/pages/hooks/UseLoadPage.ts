import {useEffect, useState} from "react";
import {Post} from "../../../models/Post";
import {useDataContext} from "../../../context/DataContext";
import {PagePostResponse} from "../../../data/model/PagePostResponse";

export function useLoadPage() {
    const { postService } = useDataContext()

    const [ posts, setPosts ] = useState<Post[] | null>(null)
    const [ page, setPage ] = useState<number | null>(null)
    const [ pageSize, setPageSize] = useState<number | null>(null)
    const [ token, setToken ] = useState<string | null>(null)

    const loadPage = (page: number, pageSize: number, token: string) => {
        setPageSize(pageSize)
        setToken(token)
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
        if (token !== null && pageSize !== null && page !== null) {
            postService.getAll(page, pageSize, token).then(res =>
                setPosts(checkPosts(res))
            )
        }
    }, [page])

    return { posts, loadPage }
}