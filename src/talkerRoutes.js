const express = require('express');
const fs = require('fs').promises;

const router = express.Router();

router.get('/', async (_request, response) => {
  try {
    const data = await fs.readFile('./src/talker.json', 'utf8');
    const talkerData = JSON.parse(data);
    response.status(200).json(talkerData);
  } catch (error) {
    console.error(`Erro ao ler o arquivo 'talker.json': ${error.message}`);
  }
});

module.exports = router;