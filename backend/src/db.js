const fs = require('fs');
const path = require('path');

// Cria um caminho absoluto para o arquivo database.json
const dbPath = path.resolve(__dirname, 'database.json');

// Função para ler os dados do banco de dados
const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Se o arquivo não existir ou houver um erro de leitura, retorna uma estrutura padrão
    console.error("Erro ao ler o banco de dados, retornando DB padrão:", error);
    return { users: [], companies: [] };
  }
};

// Função para escrever os dados no banco de dados
const writeDB = (data) => {
  try {
    // Usamos JSON.stringify com indentação para o arquivo ficar legível
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error);
  }
};

module.exports = {
  readDB,
  writeDB,
};