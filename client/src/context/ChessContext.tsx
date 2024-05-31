import React, {createContext, useContext, useState} from "react";
import {ChessService} from "../data/service/ChessService";

interface IChessContext {
    chessService: ChessService;
    fen: string | null;
    setFen: (fen: string) => void
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
    const chessService = chess
    return(
        <ChessContextProvider value={ {chessService, fen, setFen}}>
            { children }
        </ChessContextProvider>
    )
}