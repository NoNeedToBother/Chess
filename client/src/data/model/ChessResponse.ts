export interface BeginResponse {
    action: string
    color: string
    opponent: number
    gameId: string
    fen: string
}

export interface OmitResponse {
    action: string
    error: string
}

export interface MoveResponse {
    action: string
    turn: string
    /*from: string
    to: string
    promotion?: string*/
    fen: string
}