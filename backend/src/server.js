// src/server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
// O caminho para as rotas agora aponta para o arquivo mestre 'index.js'
const mainRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());

// Ponto de entrada único para todas as rotas da nossa API
app.use('/', mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});