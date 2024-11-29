// backend/app.js
const express = require('express');
const cors = require('cors');
const { connectToDatabase } = require('./database');
const sql = require('mssql');

const app = express();
app.use(cors());
app.use(express.json());

connectToDatabase();

app.get('/api/hubparadas', async (req, res) => {
    try {    
        const query = `
SELECT cdmaquina, dsparada, cdarearesp, dsarearesp, dthriniparada, stmaquina, tmpultparada
FROM viewWMTR;
        `;
        
        // Conexão com o banco de dados e execução da consulta
        const pool = await sql.connect(/* suas configurações de conexão */);
        const result = await pool.request().query(query);
          
        res.json(result.recordset); // Retorna os dados
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    } 
});

const PORT = 8006;


app.listen(PORT, () => {
    console.log(`Servidor rodando em ${PORT}`);
});
