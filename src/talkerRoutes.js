const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

const validateToken = (token) => {
  if (!token) return { status: 401, message: { message: 'Token não encontrado' } };
  if (token.length !== 16) return { status: 401, message: { message: 'Token inválido' } };
  return null;
};

const validateName = (name) => {
  if (!name) return 'O campo "name" é obrigatório';
  if (name.length < 3) return 'O "name" deve ter pelo menos 3 caracteres';
  return null;
};

const validateAge = (age) => {
  if (!age) return 'O campo "age" é obrigatório';
  if (!Number.isInteger(age) || age < 18) {
    return 'O campo "age" deve ser um número inteiro igual ou maior que 18'; 
  }
  return null;
};

const validateTalk = (talk) => {
  if (!talk) return 'O campo "talk" é obrigatório';
  return null;
};

const validateWatchedAt = (watchedAt) => {
  if (!watchedAt) return 'O campo "watchedAt" é obrigatório';
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(watchedAt)) {
    return 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"';
  }
  return null;
};

const validateRate = (rate) => {
  if (rate === undefined) return 'O campo "rate" é obrigatório';
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return 'O campo "rate" deve ser um número inteiro entre 1 e 5';
  }
  return null;
};

const validateTalkerInfo = (name, age, talk) => {
  const validators = [
    () => validateName(name),
    () => validateAge(age),
    () => validateTalk(talk),
    () => (talk ? validateWatchedAt(talk.watchedAt) : null),
    () => (talk ? validateRate(talk.rate) : null),
  ];

  const validationError = validators
    .map((validator) => validator()).find((result) => result !== null);

  return validationError ? { status: 400, message: { message: validationError } } : null;
};

router.get('/', async (_request, response) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf8');
    const talkerData = JSON.parse(data);
    response.status(200).json(talkerData);
  } catch (error) {
    console.error(`Erro ao ler o arquivo 'talker.json': ${error.message}`);
  }
});

router.get('/:id', async (request, response) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf8');
    const talkerData = JSON.parse(data);
    const talker = talkerData.find((person) => person.id === parseInt(request.params.id, 10));

    if (!talker) {
      return response.status(404).json({ message: 'Pessoa palestrante não encontrada' });
    }

    response.status(200).json(talker);
  } catch (error) {
    console.error(`Erro ao ler o arquivo 'talker.json': ${error.message}`);
  }
});

router.post('/', async (request, response) => {
  const { authorization } = request.headers;
  const { name, age, talk } = request.body;

  const tokenValidation = validateToken(authorization);
  if (tokenValidation) return response.status(tokenValidation.status).json(tokenValidation.message);
  const infoValidation = validateTalkerInfo(name, age, talk);
  if (infoValidation) return response.status(infoValidation.status).json(infoValidation.message);
  try {
    const data = await fs.readFile('./src/talker.json', 'utf8');
    const talkers = JSON.parse(data);
    const newTalker = { id: talkers[talkers.length - 1].id + 1, name, age, talk };
    talkers.push(newTalker);
    await fs.writeFile('./src/talker.json', JSON.stringify(talkers));
    return response.status(201).json(newTalker);
  } catch (error) {
    return response.status(500)
      .json({ message: `Erro ao adicionar a pessoa palestrante: ${error.message}` });
  }
});

module.exports = router;