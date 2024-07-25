const express = require('express');
const bodyParser = require('body-parser');
const getObdExplanation = require('./api/get-obd-explanation');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.post('/api/get-obd-explanation', getObdExplanation);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;
