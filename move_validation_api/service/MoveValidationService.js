const { Chess } = require("chess.js");

class MoveValidationService {

    validateMove(req) {
        console.log(req.turn)
        console.log(req.color)
        if (req.turn !== req.color) return { status: false, error: "Not your turn" }
        const chess = new Chess(req.fen)
        const move = { from: req.from, to: req.to, promotion: req.promotion }
        try {
            const moveResult = chess.move(move)
            if (moveResult === null) return { status: false, error: "Invalid move" }
        } catch (e) {
            return { status: false, error: "Invalid move" }
        }

        let result
        if (chess.isCheckmate()) result = "win"
        else if (chess.isInsufficientMaterial()) result = "insufficient"
        else if (chess.isStalemate()) result = "stalemate"
        else if (chess.isDraw()) result = "draw"

        return { status: true, result: result }
    }
}

module.exports = MoveValidationService