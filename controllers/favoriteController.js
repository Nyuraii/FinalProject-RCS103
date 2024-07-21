const connection = require('../config/mysqlConnection'); 


const getFavorites = (req, res) => {
    const { _id } = req.user;
    connection.query('SELECT * FROM favorites WHERE userId = ?', [_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('favorites', { favorites: results, user: res.locals.user });
    });
};

const addFavorite = (req, res) => {
  const { _id } = req.user; // Use MongoDB user ID
  const { productId } = req.params;
  connection.query('INSERT INTO favorites (userId, productId) VALUES (?, ?)', [_id, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Favorite added' });
  });
};

const removeFavorite = (req, res) => {
  const { _id } = req.user; // Use MongoDB user ID
  const { productId } = req.params;
  connection.query('DELETE FROM favorites WHERE userId = ? AND productId = ?', [_id, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Favorite removed' });
  });
};

module.exports = { getFavorites, addFavorite, removeFavorite };
