import React from "react";
import { Chessboard } from "react-chessboard";
import { Square, Piece } from "react-chessboard/dist/chessboard/types";
import { useChess } from "../../hooks/UseChess";
import { useChessContext } from "../../context/ChessContext";
import { useUserContext } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { CircleImage } from "../components/base/CircleImage";
import { Timer } from "../components/other/Timer";
import { SlidingInfo } from "../components/base/SlidingInfo";


export function MainPage() {
    const { fen, move, seek, color, result, concede,
        time, opponentTime, moveError, clearMoveError } = useChess()
    const { search, setSearch } = useChessContext()
    const { user, opponent } = useUserContext()

    const onDrop = (sourceSquare: Square, targetSquare: Square, piece: Piece) => {
        let promotion: string | undefined = undefined
        if (piece.charAt(1) === "P") {
            if (piece.charAt(0) === "w" && targetSquare.charAt(1) === "8") promotion = "q"
            else if (piece.charAt(1) === "b" && targetSquare.charAt(1) === "1") promotion = "q"
        }

        move({
            from: sourceSquare,
            to: targetSquare,
            promotion: promotion
        });

        return false;
    }

    const playHandler = () => {
        if (user !== null) {
            seek(user.id)
            setSearch(true)
        }
    }

    const concedeHandler = () => concede()

    const getColor = (): "black" | "white" => {
        if (color === "white") return "white";
        if (color === "black") return "black";
        else return "white";
    }

    return <div className="py-32">
        { fen !== null && color !== null &&
            <div>
                <div className="block mx-auto lg:w-[800px] lg:h-[800px] md:w-[600px] md:h-[600px] xs:w-[300px] xs:h-[300px]">
                    { opponent !== null &&
                        <span className="flex justify-center border-4 border-gray-400 shadow-md rounded-r">
                            <CircleImage src={ opponent.profilePicture } className="h-20"/>
                            <Link to={ "/profile/" + opponent.id }>
                                <div className="w-full h-full">
                                    <h2 className="ml-2 h-1/2 my-6">
                                        { opponent.username }
                                    </h2>
                                </div>
                            </Link>
                        </span>
                    }
                    <div className="mt-6">
                        <div className="lg:flex lg:flex-row gap-4">
                            <Chessboard position={ fen } autoPromoteToQueen={ true } boardOrientation={ getColor() }
                                        onPieceDrop={ onDrop } customBoardStyle={ {borderRadius: "5px"} }/>
                            { time !== null && opponentTime !== null &&
                                <div className="mx-auto md:my-auto w-[400px] h-[200px]">
                                    <Timer time={ time } opponentTime={ opponentTime }></Timer>
                                </div>
                            }
                        </div>
                        { result === undefined &&
                            <button className="w-[30%] mt-4 mx-[35%] border-2 border-red-500 hover:bg-red-100"
                                    onClick={ concedeHandler }
                            >Concede</button>
                        }
                        { result !== undefined &&
                            <>
                                <button className="w-[30%] mt-4 mx-[35%] border-2"
                                        onClick={ playHandler }
                                >Play again
                                </button>
                                <ResultFactory result={ result }/>
                            </>
                        }
                    </div>
                </div>
            </div>
        }

        { fen === null &&
            <div className="justify-center">
                <div>
                    <div>HELLO</div>
                    <button className="w-[20%] mx-[40%] my-20 border-2 border-blue-600 hover:bg-blue-100"
                            onClick={ playHandler }>PLAY</button>
                    { search &&
                        <h1 className="mx-10">Searching...</h1>
                    }
                </div>
            </div>
        }
        <SlidingInfo show={ moveError !== null } onClose={ () => clearMoveError() }>
            <div>{ moveError }</div>
        </SlidingInfo>
    </div>
}

interface ResultFactoryProps {
    result: string
}

function ResultFactory({ result }: ResultFactoryProps) {
    const winColor = "text-green-400"
    const loseColor = "text-red-800"
    const drawColor = "text-gray-500"
    const baseStyle = "text-6xl text-center"

    switch (result) {
        case "win":
            return <div className={ baseStyle + " " + winColor }>Checkmate, you won!</div>
        case "lose":
            return <div className={ baseStyle + " " + loseColor }>Checkmate, you lost!</div>
        case "draw":
            return <div className={ baseStyle + " " + drawColor }>A draw!</div>
        case "stalemate":
            return <div className={ baseStyle + " " + drawColor }>Draw, a stalemate!</div>
        case "insufficient":
            return <div className={ baseStyle + " " + drawColor }>Draw, insufficient material!</div>
        case "win_disconnect":
            return <div className={ baseStyle + " " + winColor }>Opponent disconnected, you won!</div>
        case "win_concede":
            return <div className={ baseStyle + " " + winColor }>Opponent conceded, you won!</div>
        case "lose_concede":
            return <div className={ baseStyle + " " + loseColor }>You conceded!</div>
        case "win_time":
            return <div className={ baseStyle + " " + winColor }>Opponent's time ran out, you won!</div>
        case "lose_time":
            return <div className={ baseStyle + " " + loseColor }>Your time ran out!</div>
        default:
            throw new Error(`Unknown result: ${result}`)
    }
}