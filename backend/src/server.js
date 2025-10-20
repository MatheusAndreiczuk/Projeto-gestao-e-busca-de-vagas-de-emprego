require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mainRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', mainRouter);

const PORT = 22000;
const HOST = '0.0.0.0'; 

app.listen(PORT, HOST, () => { 
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});