const { Router } = require('express');
const getVideogames = require('../controllers/getVideogames');
const getVideogamesById = require('../controllers/getVideogamesById');
const getVideogamesByName = require('../controllers/getVideogamesByName');
const postVideogame = require('../controllers/postVideogame');

const router = Router();

router.get('/:idVideogame', getVideogamesById);
router.get('/name', getVideogamesByName);
router.get('/', getVideogames);
router.post('/', postVideogame)


module.exports = router;
