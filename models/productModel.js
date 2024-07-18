const connection = require('../config/mysqlConnection');

const createProductTable = () => {
  connection.query(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2),
      category VARCHAR(255),
      stock INT,
      imageUrl TEXT,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `, (err, results, fields) => {
    if (err) {
      console.error('Error creating products table:', err.stack);
    } else {
      console.log('Products table created or already exists.');
    }
  });
};

createProductTable();

module.exports = connection;
