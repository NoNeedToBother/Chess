import {Role} from "../models/Role";
import {Post} from "../models/Post";
import {User} from "../models/User";

export function checkAuthorityToDeletePost(user: User, post: Post): boolean {
    return post.author.id === user.id ||
        user.roles.includes(Role.ADMIN) ||
        user.roles.includes(Role.CHIEF_ADMIN)
}