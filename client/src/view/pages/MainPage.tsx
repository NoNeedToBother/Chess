import React, {useEffect, useState} from "react";
import {Chessboard} from "react-chessboard";
import {PromotionPieceOption, Square} from "react-chessboard/dist/chessboard/types";
import {useChess} from "../../hooks/UseChess";
import {useChessContext} from "../../context/ChessContext";
import {useUserContext} from "../../context/UserContext";
import {useUser} from "../../hooks/UseUser";
import {Link} from "react-router-dom";
import {CircleImage} from "../components/base/CircleImage";


export function MainPage() {
    const {fen, move, seek, color, result} = useChess()
    const { search, setSearch } = useChessContext()
    const { user, opponent } = useUserContext()

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q"
        });

        return true;
    }

    const playHandler = (_: React.MouseEvent) => {
        if (user !== null) seek(user.id)
        setSearch(true)
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
                        <div className="block mx-auto w-[600px] h-[600px]">
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
                            <>
                                <Chessboard position={fen} autoPromoteToQueen={true} boardOrientation={getColor()}
                                            onPieceDrop={onDrop} customBoardStyle={{borderRadius: "5px"}}/>
                                { result !== null &&
                                    <div>
                                        { result === "win" &&
                                            <div className="text-green-400 text-6xl text-center">You won!</div>
                                        }
                                        { result === "lose" &&
                                            <div className="text-red-800 text-6xl text-center">You lost!</div>
                                        }
                                        { result === "draw" &&
                                            <div className="text-green-400 text-6xl text-center">A draw!</div>
                                        }
                                        { result === "stalemate" &&
                                            <div className="text-green-400 text-6xl text-center">A stalemate!</div>
                                        }
                                        { result === "insufficient" &&
                                            <div className="text-green-400 text-6xl text-center">Insufficient material!</div>
                                        }
                                    </div>
                                }
                            </>

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