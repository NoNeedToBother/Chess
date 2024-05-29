import {useState} from "react";
import {User} from "../models/User";
import {useUserContext} from "../context/UserContext";
import {useDataContext} from "../context/DataContext";
import {Post} from "../models/Post";

export function useUser() {
    const { userService } = useDataContext();
    const { jwt } = useUserContext()

    const [user, setUser] = useState<User | null>(null);
    const [liked, setLiked] = useState<boolean | null>(null);
    const [banned, setBanned] = useState<boolean | null>(null);
    const [userPosts, setUsersPosts] = useState<Post[] | null>(null);

    const get = (id: number) => {
        if (jwt !== null) {
            userService.get(id, jwt.accessToken).then((res) => {
                if (res.user !== undefined && res.isLiked !== undefined && res.isBanned !== undefined) {
                    setUser(res.user)
                    setLiked(res.isLiked)
                    setBanned(res.isBanned)
                }
            })
        }
    }

    const getPosts = (id: number, max: number = 5) => {
        if (jwt !== null) {
            userService.getPosts(id, max, jwt.accessToken).then((res) => {
                if (res.posts !== undefined) {
                    setUsersPosts(res.posts)
                }
            })
        }
    }

    return { user, liked, banned, get, getPosts, userPosts }
}