import { Role } from "../models/Role";
import { Post } from "../models/Post";
import { User } from "../models/User";

export function checkAuthorityToDeletePost(user: User, post: Post): boolean {
    return post.author.id === user.id ||
        user.roles.includes(Role.ADMIN) ||
        user.roles.includes(Role.CHIEF_ADMIN)
}

export function checkAuthorityToBanAndUnban(banned: User, from: User): boolean {
    if (from.roles.includes(Role.CHIEF_ADMIN) && !banned.roles.includes(Role.CHIEF_ADMIN)) return true;
    if (from.roles.includes(Role.ADMIN) &&
        !banned.roles.includes(Role.CHIEF_ADMIN) &&
        !banned.roles.includes(Role.ADMIN)
    ) return true;
    return from.roles.includes(Role.MODERATOR) &&
        !banned.roles.includes(Role.CHIEF_ADMIN) &&
        !banned.roles.includes(Role.ADMIN) &&
        !banned.roles.includes(Role.MODERATOR);

}