const connection = require('../config/mysqlConnection');


const getFavorites = (req, res) => {
  const userId = req.user.id; 
  const query = `
      SELECT products.*, favorites.id AS favoriteId 
      FROM favorites 
      JOIN products ON favorites.productId = products.id 
      WHERE favorites.userId = ?`;
  
  connection.query(query, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.render('favorites', { favorites: results, user: res.locals.user });
  });
};

const addFavorite = (req, res) => {
    const userId = req.user.id; 
    const { productId } = req.params;
    connection.query('INSERT INTO favorites (userId, productId) VALUES (?, ?)', [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Favorite added' });
    });
};

const removeFavorite = (req, res) => {
    const userId = req.user.id; 
    const { productId } = req.params;
    connection.query('DELETE FROM favorites WHERE userId = ? AND productId = ?', [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Favorite removed' });
    });
};

module.exports = { getFavorites, addFavorite, removeFavorite };
