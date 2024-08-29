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
    status: boolean
    turn?: string
    fen?: string
    result?: string
}

export interface EndResponse {
    action: string
    fen: string
    result: string
}

export interface ConcedeResponse {
    action: string
    reason: string
    conceded: boolean
}

export interface TimeResponse {
    action: string
    time: number
    opponentTime: number
}