const { Router } = require('express');
const videogamesRouter = require('./videogame.js');
const genresRouter = require('./genre.js');

const router = Router();

router.use('/videogames', videogamesRouter);
router.use('/genres', genresRouter);

module.exports = router;

