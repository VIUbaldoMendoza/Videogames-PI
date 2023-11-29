// recibirá todos los datos necesarios para crear un videojuego y
// relacionarlo con sus géneros solicitados.
// Toda la información debe ser recibida por body.
// Debe crear un videojuego en la base de datos, y este debe
// estar relacionado con sus géneros indicados (al menos uno).
const { Videogame, Genre } = require('../db.js');

const postVideogame = async (req, res) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { name, description, platforms, genres } = req.body;

    // Validar campos requeridos
    if (!name || !description || !platforms || !genres || genres.length === 0) {
      return res.status(400).json({ error: 'Se deben proporcionar todos los campos requeridos' });
    }

    // Crear el videojuego en la base de datos
    const newVideogame = await Videogame.create({
      name,
      description,
      platforms,
    });

    // Relacionar el videojuego con los géneros proporcionados
    const genresInDB = await Genre.findAll({ where: { name: genres } });

    if (genres.length !== genresInDB.length) {
      // Al menos uno de los géneros proporcionados no existe en la base de datos
      return res.status(400).json({ error: 'Uno o más géneros proporcionados no existen' });
    }

    // Asociar los géneros al videojuego
    await newVideogame.addGenres(genresInDB);

    // Obtener el videojuego con sus géneros para enviarlo en la respuesta
    const videogameWithGenres = await Videogame.findByPk(newVideogame.id, {
      include: Genre,
    });

    // Formatear la respuesta JSON
    const formattedResponse = {
      id: videogameWithGenres.id,
      name: videogameWithGenres.name,
      description: videogameWithGenres.description,
      platforms: videogameWithGenres.platforms,
      genres: videogameWithGenres.Genres.map((genre) => genre.name),
      // Agregar imagen, releaseDate, y rating según tus necesidades
      // image: 'unknown',
      releaseDate: 'unknown',
      rating: 'unknown',
    };

    res.status(201).json(formattedResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el videojuego' });
  }
};

module.exports = postVideogame;
