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
SELECT 
    RIGHT(wmtr.cdmaquina, LEN(wmtr.cdmaquina) - 3) AS cdmaquina,  
    wmtr.dsparada,
    wmtr.cdarearesp,
    wmtr.dsarearesp,
    wmtr.dthriniparada,
    wmtr.stmaquina,
    wmtr.tmpultparada,
    wmtr.nrop,
    wmtr.dsgalpao,
    ficha.dsproduto
FROM 
    viewWMTR wmtr
INNER JOIN 
    viewWMTRFichaPro ficha
ON 
    wmtr.nrop = ficha.nrop
WHERE 
    wmtr.dsgalpao IN ('TORNOS', 'INJETORAS MATRIZ', 'INJETORAS TUPIS', 'MONTAGEM', 'ENGENHARIA DE PROJETOS', 'ADMNISTRACAO', 'QUALIDADE', 'MATERIA PRIMA', 'SEGURANCA', 'RECURSOS HUMANOS', 'PCP', 'TECNOLOGIA DA INFORMACAO', 'COMERCIAL');
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

app.get('/api/ferramentaria', async (req, res) => {
    try {    
        const query = `
SELECT 
    RIGHT(wmtr.cdmaquina, LEN(wmtr.cdmaquina) - 3) AS cdmaquina,  
    wmtr.dsparada,
    wmtr.cdarearesp,
    wmtr.dsarearesp,
    wmtr.dthriniparada,
    wmtr.stmaquina,
    wmtr.tmpultparada,
    wmtr.nrop,
    wmtr.dsgalpao,
    ficha.dsproduto
FROM 
    viewWMTR wmtr
INNER JOIN 
    viewWMTRFichaPro ficha
ON 
    wmtr.nrop = ficha.nrop
WHERE 
    wmtr.dsarearesp IN ('FERRAMENTARIA', 'MANUTENCAO')`;
        
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
    console.log(`Servidor rodando em http://localhost:${PORT}/api/ferramentaria`);
});
