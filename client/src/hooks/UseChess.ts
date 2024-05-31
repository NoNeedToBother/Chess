import {useEffect, useState} from "react";
import {Chess} from "chess.js";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChessContext} from "../context/ChessContext";
import {useUserContext} from "../context/UserContext";
import {BeginResponse, MoveResponse} from "../data/model/ChessResponse";

export function useChess() {
    const { chessService, fen, setFen, color, setColor,
        turn, setTurn, gameId, setGameId } = useChessContext()
    const { user } = useUserContext()

    const [game, setGame] = useState<Chess>(new Chess())

    useEffect(() => {
        if (fen !== null) setGame(new Chess(fen))
        else setGame(new Chess())
    }, [fen])

    function move(move: { from: Square, to: Square, promotion?: string }) {
        if (turn !== color) {
            return;
        }
        try {
            let moveResult = game.move(move)
            if (moveResult === null) return
        } catch (e) {
            alert("illegal!")
            return;
        }

        let resFen = game.fen()
        if (gameId !== null && color !== null && user !== null) {
            chessService.move({
                color: color, fen: resFen, from: user.id,
                gameId: gameId, moveFrom: move.from, moveTo: move.to
            })
        }
    }

    const onSeekEnd = (response: BeginResponse) => {
        setColor(response.color)
        setGameId(response.gameId)
        setFen(response.fen)
    }

    const onMove = (response: MoveResponse) => {
        setFen(response.fen)
        setTurn(response.turn)
    }

    const seek = (id: number) => {
        if (chessService !== null) chessService.seek(id, onSeekEnd, undefined, undefined, onMove)
    }

    return {game, move, seek, color}
}