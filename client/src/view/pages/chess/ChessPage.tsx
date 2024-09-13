import React, { useState } from "react";
import { Chessboard } from "react-chessboard";
import { Square, Piece } from "react-chessboard/dist/chessboard/types";
import { useChess } from "../../../hooks/UseChess";
import { useChessContext } from "../../../context/ChessContext";
import { useUserContext } from "../../../context/UserContext";
import { Timer } from "../../components/chess/Timer";
import { SlidingInfo } from "../../components/base/SlidingInfo";
import { Searching } from "../../components/other/Searching";
import { ChessOpponentInfo } from "../../components/chess/ChessOpponentInfo";
import { ResultFactory } from "../../components/chess/ResultFactory";


export function ChessPage() {
    const { game, move, seek, concede, cancelSeek, time, moveError, clearMoveError } = useChess()
    const { search, setSearch } = useChessContext()
    const { user } = useUserContext()

    const [ selectedPiece, setSelectedPiece ] = useState<Piece | null>(null)
    const [ selectedSquare, setSelectedSquare ] = useState<Square | null>(null)

    const getPromotion = (targetSquare: Square, piece: Piece): string | undefined => {
        let promotion: string | undefined = undefined
        if (piece.charAt(1) === "P") {
            if (piece.charAt(0) === "w" && targetSquare.charAt(1) === "8") promotion = "q"
            else if (piece.charAt(1) === "b" && targetSquare.charAt(1) === "1") promotion = "q"
        }
        return promotion
    }

    const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
        const promotion = getPromotion(targetSquare, piece)

        move({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion
        });

        return false;
    }

    const onSquareClick = (square: Square, piece: Piece | undefined) => {
        if (piece === undefined) {
            if (selectedPiece === null) return
        }
        if (selectedPiece === null) {
            if (piece !== undefined) setSelectedPiece(piece)
            setSelectedSquare(square)
        } else {
            const promotion = getPromotion(square, selectedPiece)
            if (selectedSquare !== null) {
                move({
                    from: selectedSquare,
                    to: square,
                    promotion: promotion
                })
                setSelectedPiece(null)
                setSelectedSquare(null)
            }
        }
    }

    const playHandler = () => {
        if (user !== null) {
            seek(user.id)
            setSearch(true)
        }
    }
    const cancelSeekHandler = () => {
        if (user !== null) cancelSeek(user.id)
    }

    const concedeHandler = () => concede()

    const getColor = (): "black" | "white" => {
        if (game.color === "white") return "white";
        if (game.color === "black") return "black";
        else return "white";
    }

    return <div className="my-32 p-8">
        { game.fen !== null && game.color !== null &&
            <div className="block mx-auto lg:w-[800px] md:w-[600px] xs:w-[300px]">
                <ChessOpponentInfo/>
                <div className="mt-6">
                    <div className="lg:flex lg:flex-row gap-4">
                        <Chessboard position = { game.fen } autoPromoteToQueen = { true }
                                    boardOrientation = { getColor() }
                                    onPieceDrop = { onDrop }
                                    customBoardStyle = { { borderRadius: "5px" } }
                                    onSquareClick = { onSquareClick }
                        />
                        { time.time !== null && time.opponentTime !== null &&
                            <div className="mx-auto md:my-auto md:w-[400px] md:h-[200px] w-[300px] h-[150px]">
                                <Timer time={ time.time } opponentTime={ time.opponentTime }></Timer>
                            </div>
                        }
                    </div>
                    { game.result === undefined
                        ? <button className="w-[30%] mt-4 mx-[35%] border-2 border-red-500 hover:bg-red-100"
                                onClick={ concedeHandler }
                        >Concede</button>
                        : <>
                            <button className="w-[30%] mt-4 mx-[35%] border-2"
                                    onClick={ playHandler }
                            >Play again
                            </button>
                            <ResultFactory result={ game.result }/>
                        </>
                    }
                </div>
            </div>
        }

        { game.fen === null &&
            <div className="items-center border-2">
                <div>
                    <div className="text-center font-logo text-8xl dark:text-gray-100">Chess</div>
                    <div className="italic text-center py-2 dark:text-gray-100">play and discuss at same time</div>
                    <button className="w-[20%] mx-[40%] rounded-bl-2xl rounded-tr-2xl mt-20 border-2 border-blue-600 hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-700 dark:hover:bg-blue-900"
                            onClick={ playHandler }>PLAY
                    </button>
                    { search &&
                        <div className="mt-10">
                            <button className="w-[20%] mx-[40%] rounded-bl-2xl rounded-tr-2xl border-2 border-red-600 hover:bg-red-100 dark:border-red-900 dark:bg-red-700 dark:hover:bg-red-900"
                                    onClick={ cancelSeekHandler }>Cancel searching
                            </button>
                            <Searching/>
                        </div>
                    }
                </div>
            </div>
        }
        <SlidingInfo show={ moveError !== null } onClose={ () => clearMoveError() }>
            <div>{ moveError }</div>
        </SlidingInfo>
    </div>
}
