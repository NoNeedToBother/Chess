import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { Square } from "react-chessboard/dist/chessboard/types";
import { useChessContext } from "../context/ChessContext";
import { useUserContext } from "../context/UserContext";
import { BeginResponse, ConcedeResponse, EndResponse, MoveResponse, TimeResponse } from "../data/model/ChessResponse";
import { useUser } from "./UseUser";

export function useChess() {
    const { chessService, gameInfo, timeInfo, setSearch, clearChess, moveError, setMoveError } = useChessContext()
    const { user, setOpponent } = useUserContext()
    const { user: other, get } = useUser()

    const [ game, setGame ] = useState<Chess>(new Chess())

    useEffect(() => {
        if (gameInfo.fen !== null) setGame(new Chess(gameInfo.fen))
        else setGame(new Chess())
    }, [gameInfo.fen])

    function move(move: { from: Square, to: Square, promotion?: string }) {
        if (gameInfo.gameId !== null && gameInfo.color !== null && user !== null && gameInfo.fen !== null) {
            chessService.move({
                color: gameInfo.color,
                fromUser: user.id,
                gameId: gameInfo.gameId,
                from: move.from,
                to: move.to,
                promotion: move.promotion
            })
        }
    }

    useEffect(() => {
        if (other !== null) {
            setOpponent(other)
        }
    }, [other]);

    const onSeekEnd = (response: BeginResponse) => {
        gameInfo.setColor(response.color)
        gameInfo.setGameId(response.gameId)
        gameInfo.setFen(response.fen)
        setSearch(false)
        get(response.opponent)
    }

    const onMove = (response: MoveResponse) => {
        if (!response.valid) {
            if (response.error !== undefined) setMoveError(response.error)
            else setMoveError("Error when processing move, try again")
        }

        if (response.fen !== undefined && response.turn !== undefined) {
            gameInfo.setFen(response.fen)
            gameInfo.setTurn(response.turn)
        }
    }

    const onEnd = (response: EndResponse) => {
        gameInfo.setResult(response.result)
    }

    const onConcede = (response: ConcedeResponse) => {
        switch (response.reason) {
            case "disconnect":
                gameInfo.setResult("win_disconnect")
                break
            case "concede":
                if (response.conceded) gameInfo.setResult("lose_concede")
                else gameInfo.setResult("win_concede")
                break
        }
    }

    const updateTime = (response: TimeResponse) => {
        timeInfo.updateTime(response.time)
        timeInfo.updateOpponentTime(response.opponentTime)
    }

    const seek = (id: number) => {
        chessService.seek(id,
            { onSeekEnd: onSeekEnd,
                onMove: onMove,
                onEnd: onEnd,
                onConcede: onConcede,
                updateTime: updateTime
            })
        gameInfo.setResult(undefined)
        clearChess()
    }

    const concede = () => {
        if (gameInfo.gameId !== null && user !== null) {
            chessService.concede({
                gameId: gameInfo.gameId,
                from: user.id,
                reason: "concede"
            })
        }
    }

    const clearMoveError = () => setMoveError(null)

    return { fen: gameInfo.fen, game, move, seek, color: gameInfo.color, result: gameInfo.result,
        concede, time: timeInfo.time, opponentTime: timeInfo.opponentTime, moveError, clearMoveError }
}