require('dotenv').config();
// backend/database.js
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER, // O servidor deve ser uma string
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false, 
        enableArithAbort: true,
    },
    requestTimeout: 120000 // Tempo limite para cada requisição (em milissegundos)
};

async function connectToDatabase() {
    try {
        await sql.connect(config);
        console.log('Conectado ao banco de dados com sucesso');
    } catch (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    }
}

module.exports = {
    connectToDatabase,
    sql // Exporta o objeto sql para uso em outras partes do aplicativo
};