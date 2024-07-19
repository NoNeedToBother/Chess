import {useEffect, useState} from "react";
import {Chess} from "chess.js";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChessContext} from "../context/ChessContext";
import {useUserContext} from "../context/UserContext";
import {BeginResponse, EndResponse, MoveResponse} from "../data/model/ChessResponse";
import {useUser} from "./UseUser";

export function useChess() {
    const { chessService, fen, setFen, color, setColor,
        turn, setTurn, gameId, setGameId, setSearch, clearChess } = useChessContext()
    const userContext = useUserContext()
    const { user, get } = useUser()

    const [game, setGame] = useState<Chess>(new Chess())
    const [result, setResult] = useState<string | null>(null)

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
            return;
        }
        let result: string | undefined
        if (game.isCheckmate()) result = "win"
        else if (game.isInsufficientMaterial()) result = "insufficient"
        else if (game.isStalemate()) result = "stalemate"
        else if (game.isDraw()) result = "draw"
        if (gameId !== null && result !== undefined && color !== null && userContext.user !== null) {
            chessService.claimEnd({
                color: color, from: userContext.user.id, gameId: gameId, result: result, fen: game.fen()
            })
            return;
        }

        let resFen = game.fen()
        if (gameId !== null && color !== null && userContext.user !== null) {
            chessService.move({
                color: color, fen: resFen, from: userContext.user.id,
                gameId: gameId, moveFrom: move.from, moveTo: move.to, result: result
            })
        }
    }

    useEffect(() => {
        if (user !== null) {
            userContext.setOpponent(user)
        }
    }, [user]);

    const onSeekEnd = (response: BeginResponse) => {
        setColor(response.color)
        setGameId(response.gameId)
        setFen(response.fen)
        setSearch(false)
        get(response.opponent)
    }

    const onMove = (response: MoveResponse) => {
        setFen(response.fen)
        setTurn(response.turn)
    }

    const onEnd = (response: EndResponse) => {
        setResult(response.result)
        setFen(response.fen)
    }

    const seek = (id: number) => {
        if (chessService !== null) chessService.seek(id,
            { onSeekEnd, onMove, onEnd })
        setResult(null)
        clearChess()
    }

    return { fen, game, move, seek, color, result }
}