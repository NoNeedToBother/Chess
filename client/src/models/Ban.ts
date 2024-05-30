export interface Ban {
    id: number;
    bannedId: number;
    givenFromId: number;
    givenFromUsername: number;
    givenAt: string;
    reason: string;
}