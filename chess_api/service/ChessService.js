const { Chess } = require("chess.js");

class ChessService {

    validateMove(body) {
        if (body.turn !== body.color) return { valid: false, error: "Not your turn" }
        const chess = new Chess(body.fen)
        const move = { from: body.from, to: body.to, promotion: body.promotion }
        try {
            const moveResult = chess.move(move)
            if (moveResult === null) return { valid: false, error: "Invalid move" }
        } catch (e) {
            return { valid: false, error: "Invalid move" }
        }

        let result
        if (chess.isCheckmate()) result = "win"
        else if (chess.isInsufficientMaterial()) result = "insufficient"
        else if (chess.isStalemate()) result = "stalemate"
        else if (chess.isDraw()) result = "draw"

        let turn
        if (chess.turn() === "w") turn = "white"
        else turn = "black"

        return { valid: true, fen: chess.fen(), turn: turn, result: result }
    }

    convertPgnToFen(body) {
        const pgn = body.pgn
        const chess = new Chess()
        try {
            chess.loadPgn(pgn)
            return { fen: chess.fen() }
        } catch (e) {
            return { error: "Invalid pgn" }
        }
    }
}

module.exports = ChessService