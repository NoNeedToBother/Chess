import React from "react";

export interface ResultFactoryProps {
    result: string
}

export function ResultFactory({ result }: ResultFactoryProps) {
    const winColor = "text-green-400"
    const loseColor = "text-red-800"
    const drawColor = "text-gray-500"
    const baseStyle = "text-6xl text-center"

    switch (result) {
        case "win":
            return <div className={ `${ baseStyle } ${ winColor }` }>Checkmate, you won!</div>
        case "lose":
            return <div className={ `${ baseStyle } ${ loseColor }` }>Checkmate, you lost!</div>
        case "draw":
            return <div className={ `${ baseStyle } ${ drawColor }` }>A draw!</div>
        case "stalemate":
            return <div className={ `${ baseStyle } ${ drawColor }` }>Draw, a stalemate!</div>
        case "insufficient":
            return <div className={ `${ baseStyle } ${ drawColor }` }>Draw, insufficient material!</div>
        case "win_disconnect":
            return <div className={ `${ baseStyle } ${ winColor }` }>Opponent disconnected, you won!</div>
        case "win_concede":
            return <div className={ `${ baseStyle } ${ winColor }` }>Opponent conceded, you won!</div>
        case "lose_concede":
            return <div className={ `${ baseStyle } ${ loseColor }` }>You conceded!</div>
        case "win_time":
            return <div className={ `${ baseStyle } ${ winColor }` }>Opponent's time ran out, you won!</div>
        case "lose_time":
            return <div className={ `${ baseStyle } ${ loseColor }` }>Your time ran out!</div>
        default:
            throw new Error(`Unknown result: ${ result }`)
    }
}