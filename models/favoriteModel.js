const connection = require('../config/mysqlConnection');

const createFavoriteTable = () => {
  connection.query(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      productId INT,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `, (err, results, fields) => {
    if (err) {
      console.error('Error creating favorites table:', err.stack);
    } else {
      console.log('Favorites table created or already exists.');
    }
  });
};

createFavoriteTable();

module.exports = connection;
