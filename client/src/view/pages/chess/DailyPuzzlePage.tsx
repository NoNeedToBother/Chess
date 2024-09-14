import React, { useEffect, useState } from "react";
import { usePuzzle } from "../../../hooks/UsePuzzle";
import { Chessboard } from "react-chessboard";
import { Piece, Square } from "react-chessboard/dist/chessboard/types";
import { Chess } from "chess.js";
import { SlidingInfo } from "../../components/base/SlidingInfo";

export function DailyPuzzlePage() {

    const { getDailyPuzzle, dailyPuzzle, dailyPuzzleError } = usePuzzle()

    const [ color, setColor ] = useState<"white" | "black">("white")
    const [ currentMove, setCurrentMove ] = useState(0)
    const [ fen, setFen ] = useState("")
    const [ moveError, setMoveError ] = useState("")

    const [ selectedPiece, setSelectedPiece ] = useState<Piece | null>(null)
    const [ selectedSquare, setSelectedSquare ] = useState<Square | null>(null)

    useEffect(() => {
        getDailyPuzzle()
    }, []);

    useEffect(() => {
        if (dailyPuzzle !== undefined) {
            setFen(dailyPuzzle.fen)
            const fenColor = dailyPuzzle.fen.split(" ")[1]
            if (fenColor === "w") setColor("white")
            else if (fenColor === "b") setColor("black")
            else setColor("white")
        }
    }, [dailyPuzzle])

    const makeMove = (sourceSquare: Square, targetSquare: Square, botMove: string | undefined) => {
        const chess = new Chess(fen)
        chess.move({ from: sourceSquare, to: targetSquare })
        setFen(chess.fen())
        if (botMove !== undefined) {
            const firstSquare = botMove.charAt(0) + botMove.charAt(1)
            const secondSquare = botMove.charAt(2) + botMove.charAt(3)
            chess.move({from: firstSquare, to: secondSquare})
            setFen(chess.fen())
            setCurrentMove(prev => prev + 2)
        }
    }

    const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
        const move = sourceSquare + targetSquare
        if (dailyPuzzle !== undefined) {
            if (move === dailyPuzzle.solution[currentMove]) {
                makeMove(sourceSquare, targetSquare, dailyPuzzle.solution[currentMove + 1])
            }
        }
        setSelectedPiece(null)
        setSelectedSquare(null)
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
            if (selectedSquare !== null && dailyPuzzle !== undefined) {
                const move = selectedSquare + square
                if (move === dailyPuzzle.solution[currentMove]) {
                    makeMove(selectedSquare, square, dailyPuzzle.solution[currentMove + 1])
                    setSelectedPiece(null)
                    setSelectedSquare(null)
                }
            }
        }
    }

    return <div className="my-32 p-8">
        <SlidingInfo show={ dailyPuzzleError !== undefined }>
            <div>{ dailyPuzzleError }</div>
        </SlidingInfo>
        <div className="block mx-auto lg:w-[800px] md:w-[600px] xs:w-[300px]">
            <div className="mt-6">
                <div className="lg:flex lg:flex-row gap-4">
                    { dailyPuzzle !== undefined && fen !== "" &&
                        <Chessboard position = { fen }
                                    boardOrientation = { color }
                                    onPieceDrop = { onDrop }
                                    customBoardStyle = { { borderRadius: "5px" } }
                                    onSquareClick = { onSquareClick }
                        />
                    }
                </div>
            </div>
        </div>
    </div>
}