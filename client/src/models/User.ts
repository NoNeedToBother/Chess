import {Role} from "./Role";

export interface User {
    id: number;
    username: string;
    name: string | null;
    lastname: string | null;
    profilePicture: string | null;
    bio: string | null;
    dateRegistered: string;
    roles: Role[];
}