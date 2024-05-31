import {useEffect, useState} from "react";
import {Chess} from "chess.js";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChessContext} from "../context/ChessContext";
import {useUserContext} from "../context/UserContext";
import {BeginResponse} from "../data/model/ChessResponse";

export function useChess() {
    const { chessService, fen, setFen } = useChessContext()
    const { jwt } = useUserContext()
    const [game, setGame] = useState<Chess>(new Chess())
    const [color, setColor] = useState<string | null>(null)
    const [gameId, setGameId] = useState<string | null>(null)

    useEffect(() => {
        if (fen !== null) setGame(new Chess(fen))
        else setGame(new Chess())
    }, [fen])

    function move(move: { from: Square, to: Square, promotion?: string } | string) {
        const result = game.move(move);
        if (result) {
            setFen(game.fen())
            return true
        } else return false
    }

    const onSeekEnd = (response: BeginResponse) => {
        setColor(response.color)
        setGameId(response.gameId)
        setFen(response.fen)
    }

    const seek = (id: number) => {
        if (jwt !== null) {
            if (chessService !== null) chessService.seek(id, onSeekEnd)
        }
    }

    return {game, move, seek, color}
}