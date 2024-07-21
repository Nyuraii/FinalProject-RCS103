const connection = require('../config/mysqlConnection'); 

const getAllProducts = (req, res) => {
    connection.query('SELECT * FROM products', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.render('products', { products: results, user: res.locals.user });
    });
};

const createProduct = (req, res) => {
    const { name, description, price, category, stock, imageUrl } = req.body;
    connection.query(
        'INSERT INTO products (name, description, price, category, stock, imageUrl) VALUES (?, ?, ?, ?, ?, ?)',
        [name, description, price, category, stock, imageUrl],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id: results.insertId, ...req.body });
        }
    );
};

const updateProduct = (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, stock, imageUrl } = req.body;
    connection.query(
        'UPDATE products SET name = ?, description = ?, price = ?, category = ?, stock = ?, imageUrl = ? WHERE id = ?',
        [name, description, price, category, stock, imageUrl, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ id, ...req.body });
        }
    );
};

const deleteProduct = (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Product deleted' });
    });
};

module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
