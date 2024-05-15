import {Role} from "./Role";

export interface User {
    id: number;
    username: string;
    name: string;
    lastname: string;
    profilePicture: string;
    bio: string;
    dateRegistered: string;
    //roles: Role[];
}