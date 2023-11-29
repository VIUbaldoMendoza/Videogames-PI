const axios = require('axios');
const { Genre } = require('../db.js');

const getGenres = async (req, res) => {
  try {
    // Verificar si hay géneros en la base de datos
    const genresInDB = await Genre.findAll();

    if (genresInDB.length === 0) {
      // Si la base de datos está vacía, obtener géneros de la API
      const response = await axios.get('https://api.rawg.io/api/genres', {
        params: {
          key: process.env.API_KEY,
        },
      });

      const genresFromAPI = response.data.results;

      // Guardar los géneros en la base de datos
      await Genre.bulkCreate(genresFromAPI, { ignoreDuplicates: true });

      // Enviar los géneros obtenidos de la API como respuesta
      res.json(genresFromAPI);
    } else {
      // Si la base de datos ya tiene géneros, enviar esos géneros como respuesta
      res.json(genresInDB);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los géneros' });
  }
};

module.exports = getGenres;
