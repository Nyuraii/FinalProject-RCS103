const connection = require('../models/basketModel');

const getBasket = (req, res) => {
  const { userId } = req.user;
  connection.query('SELECT * FROM baskets WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const addToBasket = (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  const { quantity } = req.body;
  connection.query('INSERT INTO baskets (userId, productId, quantity) VALUES (?, ?, ?)', [userId, productId, quantity], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product added to basket' });
  });
};

const removeFromBasket = (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  connection.query('DELETE FROM baskets WHERE userId = ? AND productId = ?', [userId, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product removed from basket' });
  });
};

module.exports = { getBasket, addToBasket, removeFromBasket };
