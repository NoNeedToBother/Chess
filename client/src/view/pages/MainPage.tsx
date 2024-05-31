import React, {useEffect, useState} from "react";
import {Chessboard} from "react-chessboard";
import {Square} from "react-chessboard/dist/chessboard/types";
import {useChess} from "../../hooks/UseChess";
import {useChessContext} from "../../context/ChessContext";
import {useUserContext} from "../../context/UserContext";


export function MainPage() {
    const {move, seek, color} = useChess()
    const { fen } = useChessContext()
    const { user } = useUserContext()

    const onDrop = (sourceSquare: Square, targetSquare: Square) => {
        const result = move({
            from: sourceSquare,
            to: targetSquare,
            //promotion: "q", // always promote to a queen for example simplicity
        });

        if (result === null) return false;
        //setTimeout(moveBot, 500)
        return true;
    }

    const playHandler = (_: React.MouseEvent) => {
        if (user !== null) {
            console.log("seek req")
            seek(user.id)
        }
    }

    const getColor = (): "black" | "white" => {
        if (color === "white") return "white";
        if (color === "black") return "black";
        else return "white";
    }

    return (
        <>
            <div className="py-32">
                <div className="w-[600px] h-[600px] mx-auto">
                    { fen !== null && color !== null &&
                        <Chessboard position = { fen } boardOrientation = { getColor() } onPieceDrop = {onDrop}/>
                    }
                    { fen === null &&
                        <button className="w-20 mx-auto" onClick={ playHandler }>PLAY</button>
                    }
                </div>
            </div>
        </>

    )
}