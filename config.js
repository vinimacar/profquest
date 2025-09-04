/**
 * EXEMPLO DE CONFIGURAÇÃO SEGURA PARA AMBIENTE DE PRODUÇÃO
 * 
 * Este é um exemplo de como você poderia implementar uma configuração
 * segura para a chave da API em um ambiente de produção com Node.js.
 * 
 * NÃO USE ESTE ARQUIVO DIRETAMENTE - ele serve apenas como exemplo.
 */

// Configuração para ambiente de produção (Node.js)
const config = {
    // A chave da API seria carregada de uma variável de ambiente
    // e não estaria hardcoded no código
    apiKey: process.env.OPENAI_API_KEY,
    
    // Outras configurações
    modeloIA: process.env.MODELO_IA || 'gpt-4',
    maxTokens: process.env.MAX_TOKENS || 2000,
    temperatura: process.env.TEMPERATURA || 0.7
};

/**
 * EXEMPLO DE IMPLEMENTAÇÃO DE PROXY DE API
 * 
 * Em um ambiente de produção, você poderia criar um endpoint
 * de proxy no seu backend para fazer as chamadas à API do OpenAI
 * sem expor sua chave no frontend.
 */

// Exemplo com Express.js
/*
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Endpoint de proxy para a API do OpenAI
app.post('/api/gerar-questoes', async (req, res) => {
    try {
        // A chave da API fica apenas no servidor
        const apiKey = process.env.OPENAI_API_KEY;
        
        // Dados recebidos do frontend
        const { prompt, modeloIA } = req.body;
        
        // Chamada para a API do OpenAI
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: modeloIA || 'gpt-4',
            messages: [{
                role: "user",
                content: prompt
            }],
            temperature: 0.7,
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        
        // Retornar apenas os dados necessários para o frontend
        res.json(response.data);
    } catch (error) {
        console.error('Erro ao chamar a API:', error);
        res.status(500).json({ erro: 'Erro ao processar a requisição' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
*/

// Este arquivo é apenas um exemplo e não deve ser usado diretamente
// Adicione-o ao .gitignore para garantir que não seja commitado
