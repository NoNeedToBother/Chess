const express = require('express');
const { body, validationResult } = require('express-validator');
const ChessService = require("../service/ChessService");
const router = express.Router();

router.post('/',
    [
        body('pgn').isString().notEmpty()
    ],
    function(req, res) {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: "Incorrect request" })
        }
        const service = new ChessService()
        try {
            const result = service.convertPgnToFen(req.body)
            if (result.fen !== undefined) {
                res.status(200).json(result)
            } else if (result.error !== undefined) {
                if (result.error === "Invalid pgn") {
                    res.status(400).json({ error: result.error })
                } else res.status(500).json({ error: "Something went wrong, try again later" })
            }
            else res.status(500).json({ error: "Something went wrong, try again later" })
        } catch (e) {
            res.status(500).json({ error: "Something went wrong, try again later" })
        }
    }
)

module.exports = router