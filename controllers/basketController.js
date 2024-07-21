const connection = require('../config/mysqlConnection'); 

const getBasket = (req, res) => {
    const { _id } = req.user;
    connection.query('SELECT * FROM baskets WHERE userId = ?', [_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('baskets', { baskets: results, user: res.locals.user });
    });
};


const addToBasket = (req, res) => {
  const { _id } = req.user; // Use MongoDB user ID
  const { productId } = req.params;
  const { quantity } = req.body;
  connection.query('INSERT INTO baskets (userId, productId, quantity) VALUES (?, ?, ?)', [_id, productId, quantity], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product added to basket' });
  });
};

const removeFromBasket = (req, res) => {
  const { _id } = req.user; // Use MongoDB user ID
  const { productId } = req.params;
  connection.query('DELETE FROM baskets WHERE userId = ? AND productId = ?', [_id, productId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Product removed from basket' });
  });
};

module.exports = { getBasket, addToBasket, removeFromBasket };
