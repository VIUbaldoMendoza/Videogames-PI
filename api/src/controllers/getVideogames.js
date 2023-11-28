const axios = require('axios');
const { Videogame } = require('../db.js');

const getVideogames = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    if (page <= 0) {
      return res.status(400).json({ error: 'La página debe ser un número positivo' });
    }

    const response = await axios.get('https://api.rawg.io/api/games', {
      params: {
        key: process.env.API_KEY,
        page,
        page_size: 5,
      },
    });

    const videogamesFromAPI = response.data.results;

    const selectedFields = videogamesFromAPI.map((game) => ({
      id: game.id || 'unknown',
      name: game.name || 'unknown',
      description: game.description || 'unknown',
      platforms: game.platforms.map((platform) => platform.platform.name).join(', ') || 'unknown',
      image: game.background_image || 'unknown',
      releaseDate: game.released || 'unknown',
      rating: game.rating || 'unknown',
    }));

    const paginationInfo = {
      count: response.data.count || 0,
      next: response.data.next || null,
      previous: response.data.previous || null,
    };

    const jsonResponse = {
      pagination: paginationInfo,
      videogames: selectedFields,
    };

    await Videogame.bulkCreate(selectedFields, { ignoreDuplicates: true });

    res.json(jsonResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener y almacenar videojuegos', apiError: error.message });
  }
};

module.exports = getVideogames;
