import React, {createContext, useContext, useState} from "react";
import {ChessService} from "../data/service/ChessService";

interface IChessContext {
    chessService: ChessService;
    fen: string | null;
    setFen: (fen: string) => void;
    search: boolean;
    changeSearch: () => void;
    turn: string;
    setTurn: (value: string) => void;
    clear: () => void;
    color: string | null;
    setColor: (color: string) => void;
    gameId: string | null;
    setGameId: (id: string) => void;
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
    const chessService = chess
    const changeSearch = () => setSearch(prev => !prev)

    const clear = () => {
        setFen(null)
        setSearch(false)
        setTurn("white")
    }
    return(
        <ChessContextProvider value={ {chessService, fen, setFen, search, changeSearch,
            turn, setTurn, clear, color, setColor, gameId, setGameId }}>
            { children }
        </ChessContextProvider>
    )
}