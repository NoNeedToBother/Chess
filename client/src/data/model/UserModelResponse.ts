export interface UserModelResponse {
    id: number;
    username: string;
    name: string | null;
    lastname: string | null;
    profilePicture: string;
    bio: string | null;
    dateRegistered: string;
    roles: string[]
}