const express = require('express');
const crypto = require('crypto');

const router = express.Router();

router.post('/', (_request, response) => {
  const token = crypto.randomBytes(8).toString('hex');
  response.status(200).json({ token });
});

module.exports = router;