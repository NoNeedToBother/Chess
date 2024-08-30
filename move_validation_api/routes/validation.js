const express = require('express');
const { body, validationResult } = require('express-validator');
const MoveValidationService = require("../service/MoveValidationService");
const router = express.Router();

router.post('/',
    [
      body('turn').isString().notEmpty(),
      body('color').isString().notEmpty(),
      body('fen').isString().notEmpty(),
      body('from').isString().notEmpty(),
      body('to').isString().notEmpty(),
      body('promotion').optional().isString(),
    ],
    function(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: "Incorrect request" });
  }
  const service = new MoveValidationService()
  const result = service.validateMove(req.body)
  res.status(200).json(result)
});

module.exports = router;
