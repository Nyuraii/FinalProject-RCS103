const connection = require('../models/favoriteModel');

const getFavorites = (req, res) => {
  const { userId } = req.user;
  connection.query('SELECT * FROM favorites WHERE userId = ?', [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const addFavorite = (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  connection.query('INSERT INTO favorites (userId, productId) VALUES (?, ?)', [userId, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Favorite added' });
  });
};

const removeFavorite = (req, res) => {
  const { userId } = req.user;
  const { productId } = req.params;
  connection.query('DELETE FROM favorites WHERE userId = ? AND productId = ?', [userId, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Favorite removed' });
  });
};

module.exports = { getFavorites, addFavorite, removeFavorite };
