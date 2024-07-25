const axios = require('axios');
require('dotenv').config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const openaiInstance = axios.create({
    baseURL: 'https://api.openai.com/v1/engines/davinci-codex',
    headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
    }
});

module.exports = openaiInstance;
