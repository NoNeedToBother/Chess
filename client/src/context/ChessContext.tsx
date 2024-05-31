import React, {createContext, useContext, useState} from "react";
import {ChessService} from "../data/service/ChessService";
import {useUserContext} from "./UserContext";

interface IChessContext {
    chessService: ChessService;
    fen: string | null;
    setFen: (fen: string | null) => void;
    search: boolean;
    setSearch: (search: boolean) => void;
    turn: string;
    setTurn: (value: string) => void;
    clearChess: () => void;
    color: string | null;
    setColor: (color: string | null) => void;
    gameId: string | null;
    setGameId: (id: string | null) => void;
    opponent: number | null;
    setOpponent: (id: number | null) => void
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

    }
    return(
        <ChessContextProvider value={ {chessService, fen, setFen, search, setSearch,
            turn, setTurn, clearChess, color, setColor, gameId, setGameId, opponent, setOpponent }}>
            { children }
        </ChessContextProvider>
    )
}