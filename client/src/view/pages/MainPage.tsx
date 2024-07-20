import React from "react";
import {Chessboard} from "react-chessboard";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChess} from "../../hooks/UseChess";
import {useChessContext} from "../../context/ChessContext";
import {useUserContext} from "../../context/UserContext";
import {Link} from "react-router-dom";
import {CircleImage} from "../components/base/CircleImage";


export function MainPage() {
    const {fen, move, seek, color, result, concede} = useChess()
    const { search, setSearch } = useChessContext()
    const { user, opponent } = useUserContext()

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        return false;
    }

    const playHandler = () => {
        if (user !== null) {
            seek(user.id)
            setSearch(true)
        }
    }

    const concedeHandler = () => {
        concede()
    }

    const getColor = (): "black" | "white" => {
        if (color === "white") return "white";
        if (color === "black") return "black";
        else return "white";
    }

    //customPieces = {{wK: () => <img className="w-[75px] h-[75px]" src="..."/>}
    return (
        <>
            <div className="py-32">
                {fen !== null && color !== null &&
                    <span>
                        <div className="block mx-auto lg:w-[600px] lg:h-[600px] md:w-[400px] md:h-[400px]">
                        { opponent !== null &&
                            <span className="flex justify-center border-4 border-gray-400 shadow-md rounded-r">
                                <CircleImage src={ opponent.profilePicture } className="h-20"/>
                                <Link to={"/profile/" + opponent.id}>
                                    <div className="w-full h-full">
                                        <h2 className="ml-2 h-1/2 my-6">
                                            {opponent.username}
                                        </h2>
                                    </div>
                                </Link>
                            </span>
                        }
                        <div className="mt-6">
                            <Chessboard position={fen} autoPromoteToQueen={true} boardOrientation={getColor()}
                                        onPieceDrop={onDrop} customBoardStyle={{borderRadius: "5px"}}/>
                            <button className="w-[30%] mt-4 mx-[35%] border-2 border-red-500 hover:bg-red-100"
                                    onClick={ concedeHandler }
                            >Concede</button>
                            { result !== undefined &&
                                <ResultFactory result={ result }/>
                            }
                        </div>
                    </div>
                    </span>
                }
                {fen === null &&
                    <div className="w-full flex items-start">
                        <img alt="chessboard"
                            src="https://hichess.ru/wa-data/public/shop/products/40/35/3540/images/17699/17699.970.jpg"/>
                        <div className="flex-col">
                        <button className="w-20 mx-20 my-20 border-2 border-blue-600 hover:bg-blue-100" onClick={playHandler}>PLAY</button>
                            { search &&
                                <h1 className="mx-10">Searching...</h1>
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
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
            return <div className={baseStyle + " " + winColor}>Checkmate, you won!</div>
        case "lose":
            return <div className={baseStyle + " " + loseColor}>Checkmate, you lost!</div>
        case "draw":
            return <div className={baseStyle + " " + drawColor}>A draw!</div>
        case "stalemate":
            return <div className={baseStyle + " " + drawColor}>Draw, a stalemate!</div>
        case "insufficient":
            return <div className={baseStyle + " " + drawColor}>Draw, insufficient material!</div>
        case "win_disconnect":
            return <div className={baseStyle + " " + winColor}>Opponent disconnected, you won!</div>
        case "win_concede":
            return <div className={baseStyle + " " + winColor}>Opponent conceded, you won!</div>
        case "lose_concede":
            return <div className={baseStyle + " " + loseColor}>You conceded!</div>
        default:
            throw new Error(`Unknown result: ${result}`)
    }
}