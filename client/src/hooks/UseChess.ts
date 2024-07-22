import {useEffect, useState} from "react";
import {Chess} from "chess.js";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChessContext} from "../context/ChessContext";
import {useUserContext} from "../context/UserContext";
import {BeginResponse, ConcedeResponse, EndResponse, MoveResponse} from "../data/model/ChessResponse";
import {useUser} from "./UseUser";

export function useChess() {
    const { chessService, gameInfo, setSearch, clearChess } = useChessContext()
    const { user, setOpponent } = useUserContext()
    const { user: other, get } = useUser()

    const [game, setGame] = useState<Chess>(new Chess())

    useEffect(() => {
        if (gameInfo.fen !== null) setGame(new Chess(gameInfo.fen))
        else setGame(new Chess())
    }, [gameInfo.fen])

    function move(move: { from: Square, to: Square, promotion?: string }) {
        if (gameInfo.turn !== gameInfo.color) {
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
        if (gameInfo.gameId !== null && result !== undefined && gameInfo.color !== null && user !== null) {
            chessService.claimEnd({
                color: gameInfo.color, from: user.id, gameId: gameInfo.gameId, result: result, fen: game.fen()
            })
            return;
        }

        let resFen = game.fen()
        if (gameInfo.gameId !== null && gameInfo.color !== null && user !== null) {
            chessService.move({
                color: gameInfo.color, fen: resFen, from: user.id, gameId: gameInfo.gameId
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
        gameInfo.setFen(response.fen)
        gameInfo.setTurn(response.turn)
    }

    const onEnd = (response: EndResponse) => {
        gameInfo.setResult(response.result)
        gameInfo.setFen(response.fen)
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

    const seek = (id: number) => {
        chessService.seek(id,
            { onSeekEnd: onSeekEnd,
                onMove: onMove,
                onEnd: onEnd,
                onConcede: onConcede
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

    return { fen: gameInfo.fen, game, move, seek, color: gameInfo.color, result: gameInfo.result, concede }
}