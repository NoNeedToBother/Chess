const express = require('express');
const MoveValidationService = require("../service/MoveValidationService");
const router = express.Router();

router.post('/', function(req, res) {
  const service = new MoveValidationService()
  const result = service.validateMove(req.body)
  res.status(200).json(result)
});

module.exports = router;
