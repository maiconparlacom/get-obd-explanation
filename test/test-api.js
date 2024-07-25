const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/explain', async (req, res) => {
    const { latitude, longitude, vin, dtc } = req.body;

    if (!latitude || !longitude || !vin || !dtc) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const prompt = `
Você é um especialista em OBD (on-board diagnostics) e mecânica automotiva. O OBD é um sistema eletrônico que fornece autodiagnóstico e relatórios de veículos. Preciso de sua ajuda para analisar um código de erro específico e fornecer informações detalhadas.

1. Consulte a "tabela-de-codigos-OBD2" e verifique o significado do código de erro DTC fornecido. Explique de forma detalhada e simples o problema identificado, incluindo a causa possível e as etapas recomendadas para a resolução.

2. Após identificar o problema, consulte fontes confiáveis de peças automotivas e mecânicas para fornecer o valor médio da peça necessária para resolver o problema. Inclua também uma estimativa do custo de reparo (Em R$).

3. Com base na latitude e longitude fornecidas, gere um link clicável do Google Maps para encontrar a mecânica mais próxima, caso o problema identificado esteja relacionado a componentes do carro. O link deve ser apresentado no formato:
https://www.google.com/maps/search/mecânica/@LATITUDE,LONGITUDE,14z/data=!3m1!4b1?entry=ttu

4. Se o problema estiver relacionado ao combustível, gere um link clicável do Google Maps para encontrar o posto de combustível mais próximo. O link deve ser apresentado no formato:
https://www.google.com/maps/search/posto+de+combustível/@LATITUDE,LONGITUDE,14z?entry=ttu

5. Forneça as informações mais importantes de forma resumida e estruturada, incluindo:
   - Descrição detalhada do problema e possíveis causas.
   - Etapas recomendadas para a resolução.
   - Valor médio da peça e estimativa de custo de reparo.
   - Link para a mecânica ou posto de combustível mais próximo, conforme aplicável.

OBS:
- Como não é possível integrar diretamente um arquivo PDF, consulte tabelas de códigos OBD2 disponíveis na internet e utilize seu conhecimento para fornecer as informações solicitadas.

Aqui estão as informações fornecidas:
- Latitude: ${latitude}
- Longitude: ${longitude}
- VIN: ${vin}
- Código DTC: ${dtc}

Forneça a resposta de forma clara e organizada para facilitar o entendimento e a execução das recomendações.
`;

    const openAiApiKey = process.env.OPENAI_API_KEY;
    const openAiApiUrl = "https://api.openai.com/v1/chat/completions";

    try {
        const response = await axios.post(openAiApiUrl, {
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert in OBD error codes." },
                { role: "user", content: prompt }
            ]
        }, {
            headers: {
                'Authorization': `Bearer ${openAiApiKey}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while communicating with the OpenAI API' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
