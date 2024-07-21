const express = require('express');
const { getBasket, addToBasket, removeFromBasket } = require('../controllers/basketController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getBasket);
router.post('/:productId', auth, addToBasket);
router.delete('/:productId', auth, removeFromBasket);

module.exports = router;
