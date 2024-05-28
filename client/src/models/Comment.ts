import {User} from "./User";

export interface Comment {
    id: number;
    author: User;
    datePublished: string;
    content: string;
    rating: number;
}