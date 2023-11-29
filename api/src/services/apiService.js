const axios = require('axios');

const apiKey = process.env.API_KEY;

const apiService = axios.create({
  baseURL: 'https://api.rawg.io/v1/', // Reemplaza con la URL base de la API
  headers: {
    'Authorization': `Bearer ${apiKey}`,
  },
});

module.exports = apiService;
