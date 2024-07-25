require('dotenv').config();
const fetch = require('node-fetch');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const apiKey = process.env.OPENAI_API_KEY;
const endpoint = 'https://api.openai.com/v1/chat/completions';
const modelId = 'gpt-4';

app.use(express.json());

function generatePrompt(dtcValue, vinValue, latitude, longitude) {
    return `Chat, preciso que você seja um especialista em OBD (on-board diagnostics) e mecânica de veículos.

1. Explique o problema do código OBD "DTC" de forma simples e direta utilizando a tabela de códigos OBD2.
2. Pesquise o custo médio para reparar o problema com peças e serviço.
3. Forneça um link do Google Maps para uma mecânica próxima usando a latitude e longitude fornecidas.
4. Caso seja um problema de combustível, forneça um link para um posto de combustível próximo.

Dados:
- Problema: "${dtcValue}"
- Chassi: "${vinValue}"
- Latitude: "${latitude}"
- Longitude: "${longitude}"

Exemplo de links:
Mecânica Próxima: [https://www.google.com/maps/search/mecânica/@${latitude},${longitude},14z/data=!3m1!4b1?entry=ttu]
Posto de Combustível: [https://www.google.com/maps/search/posto+de+combustível/@${latitude},${longitude},14z?entry=ttu]

Resuma as informações e forneça os links clicáveis.`;
}

async function getGPTResponse(prompt) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: modelId,
            messages: [
                { role: 'system', content: 'Você é um especialista em OBD e mecânica de veículos.' },
                { role: 'user', content: prompt }
            ],
            max_tokens: 600
        }),
    });

    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
}

app.post('/api/get-obd-explanation', async (req, res) => {
    const { dtc, vin, latitude, longitude } = req.body;

    if (!dtc || !vin || !latitude || !longitude) {
        return res.status(400).json({ error: 'Parâmetros insuficientes. Certifique-se de fornecer dtc, vin, latitude e longitude.' });
    }

    try {
        const prompt = generatePrompt(dtc, vin, latitude, longitude);
        const gptResponse = await getGPTResponse(prompt);
        res.status(200).json({ response: gptResponse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
