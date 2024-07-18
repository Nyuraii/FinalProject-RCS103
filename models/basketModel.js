const connection = require('../config/mysqlConnection');

const createBasketTable = () => {
  connection.query(`
    CREATE TABLE IF NOT EXISTS baskets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT,
      productId INT,
      quantity INT,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `, (err, results, fields) => {
    if (err) {
      console.error('Error creating baskets table:', err.stack);
    } else {
      console.log('Baskets table created or already exists.');
    }
  });
};

createBasketTable();

module.exports = connection;
