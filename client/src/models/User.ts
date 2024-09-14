import { Role } from "./Role";

export interface User {
    id: number;
    username: string;
    name: string | null;
    lastname: string | null;
    profilePicture: string;
    bio: string | null;
    dateRegistered: string;
    likes: number;
    roles: Role[];
}