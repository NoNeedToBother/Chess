const { Chess } = require("chess.js");

class MoveValidationService {

    validateMove(req) {
        if (req.turn !== req.color) return { valid: false, error: "Not your turn" }
        const chess = new Chess(req.fen)
        const move = { from: req.from, to: req.to, promotion: req.promotion }
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
}

module.exports = MoveValidationService