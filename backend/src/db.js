const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Erro ao ler o banco de dados, retornando DB padrão:", error);
    return { users: [], companies: [] };
  }
};

const writeDB = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Erro ao escrever no banco de dados:", error);
  }
};

module.exports = {
  readDB,
  writeDB,
};