import React, {createContext, useContext, useState} from "react";
import {ChessService} from "../data/service/ChessService";
import {useUserContext} from "./UserContext";

interface IChessContext {
    chessService: ChessService;
    gameInfo: GameInfo
    search: boolean;
    setSearch: (search: boolean) => void;
    clearChess: () => void;
}

export interface GameInfo {
    fen: string | null
    setFen: (fen: string | null) => void
    turn: string
    setTurn: (value: string) => void
    color: string | null
    setColor: (color: string | null) => void
    gameId: string | null
    setGameId: (id: string | null) => void
    opponent: number | null
    setOpponent: (id: number | null) => void
    result: string | undefined
    setResult: (result: string | undefined) => void
}

const ChessContext = createContext<IChessContext | null>(null)

export const ChessContextProvider = ChessContext.Provider

export const useChessContext = () => {
    const data = useContext(ChessContext)
    if (!data) {
        throw new Error("Attempt to call DataContext outside of the provider")
    }
    return data
}

interface ChessStateProps {
    chess: ChessService;
    children: React.ReactNode;
}

export const ChessState = ({children, chess}: ChessStateProps) => {
    const [fen, setFen] = useState<string | null>(null)
    const [turn, setTurn] = useState<string>("white")
    const [search, setSearch] = useState(false)
    const [color, setColor] = useState<string | null>(null)
    const [gameId, setGameId] = useState<string | null>(null)
    const [ opponent, setOpponent ] = useState<number | null>(null)
    const [time, setTime] = useState<number | null>(0)
    const [result, setResult] = useState<string | undefined>(undefined)

    const opponentContext = useUserContext()
    const chessService = chess

    const clearChess = () => {
        setFen(null)
        setSearch(false)
        setTurn("white")
        setOpponent(null)
        setGameId(null)
        opponentContext.setOpponent(null)
        setColor(null)
        setTime(0)
    }

    const gameInfo = {
        fen, setFen, turn, setTurn, color, setColor, gameId, setGameId, opponent, setOpponent, result, setResult
    }

    return(
        <ChessContextProvider value={ {chessService, gameInfo, search, setSearch, clearChess }}>
            { children }
        </ChessContextProvider>
    )
}