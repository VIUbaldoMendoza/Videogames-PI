//debe obtener los primeros 15 videojuegos que se encuentren con la palabra recibida por query.
//Debe poder buscarlo independientemente de mayúsculas o minúsculas.
//Si no existe el videojuego, debe mostrar un mensaje adecuado.
//Debe buscar tanto los de la API como los de la base de datos.
const axios = require('axios');
const { Videogame } = require('../db.js');

const getVideogamesByName = async (req, res) => {
  try {
    const nameQuery = req.query.name.toLowerCase();

    const videojuegosFromDB = await Videogame.findAll({
      where: {
        name: {
          [Videogame.Op.iLike]: `%${nameQuery}%`,
        },
      },
      limit: 15,
    });

    if (videojuegosFromDB.length === 0) {
      const response = await axios.get('https://api.rawg.io/api/games', {
        params: {
          key: process.env.API_KEY,
          search: nameQuery,
          page_size: 15,
        },
      });

      const videogamesFromAPI = response.data.results;

      if (videogamesFromAPI.length === 0) {
        res.status(404).json({ error: 'No se encontraron videojuegos con la palabra proporcionada' });
        return;
      }

      const selectedFields = videogamesFromAPI.map((game) => ({
        id: game.id || 'unknown',
        name: game.name || 'unknown',
        description: game.description || 'unknown',
        platforms: game.platforms.map((platform) => platform.platform.name).join(', ') || 'unknown',
        image: game.background_image || 'unknown',
        releaseDate: game.released || 'unknown',
        rating: game.rating || 'unknown',
      }));

      res.json(selectedFields);
      return;
    }

    res.json(videojuegosFromDB);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener videojuegos por nombre' });
  }
};

module.exports = getVideogamesByName;

