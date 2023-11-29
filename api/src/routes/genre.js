const { Router } = require('express');
const getGenres = require('../controllers/getGenres');

const router = Router();

router.get('/', getGenres);

module.exports = router;
