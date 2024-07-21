const connection = require('../config/mysqlConnection');

const getBasket = (req, res) => {
  const userId = req.user.id; // Ensure user ID is extracted correctly
  const query = `
      SELECT products.*, baskets.quantity, baskets.id AS basketId 
      FROM baskets 
      JOIN products ON baskets.productId = products.id 
      WHERE baskets.userId = ?`;
  
  connection.query(query, [userId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      res.render('baskets', { baskets: results, user: res.locals.user });
  });
};

const addToBasket = (req, res) => {
    const userId = req.user.id; 
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
    const userId = req.user.id; 
    const { productId } = req.params;
    connection.query('DELETE FROM baskets WHERE userId = ? AND productId = ?', [userId, productId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product removed from basket' });
    });
};

module.exports = { getBasket, addToBasket, removeFromBasket };
