import { useState } from "react";
import { User } from "../models/User";
import { useUserContext } from "../context/UserContext";
import { useDataContext } from "../context/DataContext";
import { Post } from "../models/Post";
import { Ban } from "../models/Ban";

export function useUser() {
    const { userService } = useDataContext();
    const { jwt } = useUserContext()

    const [ user, setUser ] = useState<User | null>(null);
    const [ liked, setLiked ] = useState<boolean | null>(null);
    const [ ban, setBan ] = useState<Ban | null>(null);
    const [ userPosts, setUsersPosts ] = useState<Post[] | null>(null);

    const get = (id: number) => {
        if (jwt !== null) {
            userService.get(id, jwt).then((res) => {
                if (res.user !== undefined && res.isLiked !== undefined) {
                    setUser(res.user)
                    setLiked(res.isLiked)
                    if (res.ban !== undefined) setBan(res.ban)
                    else setBan(null)
                }
            })
        }
    }

    const getPosts = (id: number, max: number = 5) => {
        if (jwt !== null) {
            userService.getPosts(id, max, jwt).then((res) => {
                if (res.posts !== undefined) {
                    setUsersPosts(res.posts)
                }
            })
        }
    }

    const updateLike = (id: number) => {
        if (jwt !== null) {
            userService.updateLike(id, jwt).then((res) => {
                if (res.user !== undefined && res.isLiked !== undefined) {
                    setUser(res.user)
                    setLiked(res.isLiked)
                    if (res.ban !== undefined) setBan(res.ban)
                }
            })
        }
    }

    return { user, liked, ban, get, getPosts, userPosts, updateLike }
}