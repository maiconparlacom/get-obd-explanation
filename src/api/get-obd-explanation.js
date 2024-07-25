const openai = require('../config/openai');

const getObdExplanation = async (req, res) => {
    const { prompt, latitude, longitude, vin, dtc } = req.body;

    if (!prompt || !latitude || !longitude || !vin || !dtc) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const response = await openai.post('/completions', {
            model: 'text-davinci-003',
            prompt: `${prompt}\nLatitude: ${latitude}\nLongitude: ${longitude}\nVIN: ${vin}\nDTC: ${dtc}`,
            max_tokens: 100,
            n: 1,
            stop: null,
            temperature: 0.7
        });

        res.json({ explanation: response.data.choices[0].text.trim() });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the explanation' });
    }
};

module.exports = getObdExplanation;
