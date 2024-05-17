import {User} from "./User";

export interface Post {
    id: number;
    author: User;
    imageUrl: string;
    title: string;
    content: string;
    description: string;
    datePoster: string;
    rating: number;
}