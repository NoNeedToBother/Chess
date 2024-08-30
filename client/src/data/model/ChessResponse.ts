export interface BeginResponse {
    action: string
    color: string
    opponent: number
    gameId: string
    fen: string
}

export interface CancelResponse {
    action: string
    error: string
}

export interface MoveResponse {
    action: string
    valid: boolean
    turn?: string
    fen?: string
    result?: string
    error?: string
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