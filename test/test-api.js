const axios = require('axios');

const testApi = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/get-obd-explanation', {
            prompt: 'Explain the error code',
            latitude: '12.345678',
            longitude: '-98.765432',
            vin: '1HGCM82633A123456',
            dtc: 'P0420'
        });

        console.log(response.data);
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
    }
};

testApi();
