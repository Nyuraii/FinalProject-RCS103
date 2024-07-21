const express = require('express');
const { getFavorites, addFavorite, removeFavorite } = require('../controllers/favoriteController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getFavorites);
router.post('/:productId', auth, addFavorite);
router.delete('/:productId', auth, removeFavorite);

module.exports = router;
