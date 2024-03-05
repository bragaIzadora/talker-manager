const express = require('express');
const crypto = require('crypto');

const router = express.Router();

const validateEmail = (email, response) => {
  if (!email) {
    return response.status(400).json({ message: 'O campo "email" é obrigatório' });
  }

  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }

  return true;
};

const validatePassword = (password, response) => {
  if (!password) {
    return response.status(400).json({ message: 'O campo "password" é obrigatório' });
  }

  if (password.length < 6) {
    return response.status(400).json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }

  return true;
};

router.post('/', (request, response) => {
  const { email, password } = request.body;

  if (!validateEmail(email, response)) return;
  if (!validatePassword(password, response)) return;

  const token = crypto.randomBytes(8).toString('hex');
  response.status(200).json({ token });
});

module.exports = router;