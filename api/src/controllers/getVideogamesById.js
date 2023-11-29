// obtiene el detalle de un videojuego específico.
// El videojuego es recibido por parámetro (ID).
// Tiene que incluir los datos del género del videojuego al
//que está asociado.
// Debe funcionar tanto para los videojuegos de la API como
//para los de la base de datos.
const axios = require('axios');
const { Videogame } = require('../db.js');

const getVideogamesById = async (req, res) => {
  try {
    // Validación de ID de videojuego
    let idVideogame = req.params.idVideogame;
    if (!idVideogame) {
      return res.status(400).json({ error: 'ID de videojuego no proporcionado' });
    }

    const videogameFromDB = await Videogame.findOne({ where: { id: idVideogame } });

    if (videogameFromDB) {
      // Obtener información sobre géneros desde la base de datos
      const genres = await videogameFromDB.getGenres();

      // Respuesta para videojuegos de la base de datos
      res.json({
        id: videogameFromDB.id,
        name: videogameFromDB.name,
        description: videogameFromDB.description || 'unknown',
        platforms: videogameFromDB.platforms || 'unknown',
        image: videogameFromDB.image || 'unknown',
        releaseDate: videogameFromDB.releaseDate || 'unknown',
        rating: videogameFromDB.rating || 'unknown',
        genres: genres.map((genre) => genre.name).join(', ') || 'unknown',
      });
    } else {
      // Respuesta para videojuegos de la API externa
      const response = await axios.get(`https://api.rawg.io/api/games/${idVideogame}`, {
        params: {
          key: process.env.API_KEY,
        },
      });

      const videogameFromAPI = response.data;

      // Resto del código para manejar la respuesta de la API externa
      const genres = videogameFromAPI.genres.map((genre) => genre.name).join(', ') || 'unknown';
      const videogameDetail = {
        id: videogameFromAPI.id,
        name: videogameFromAPI.name,
        description: videogameFromAPI.description || 'unknown',
        platforms: videogameFromAPI.platforms.map((platform) => platform.platform.name).join(', ') || 'unknown',
        image: videogameFromAPI.background_image || 'unknown',
        releaseDate: videogameFromAPI.released || 'unknown',
        rating: videogameFromAPI.rating || 'unknown',
        genres: genres || 'unknown',
      };

      res.json(videogameDetail);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el detalle del videojuego' });
  }
};

module.exports = getVideogamesById;
