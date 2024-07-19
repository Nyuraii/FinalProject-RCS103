const router = require("express").Router();
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User"); 
const connection = require('../models/productModel'); 
const bcrypt = require('bcryptjs');
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const { updateUser, deleteUser } = require('../controllers/userController'); 

// Admin dashboard
router.get("/", adminAuth, async (req, res) => {
    try {
        // Fetch users from MongoDB
        const users = await User.find();

        // Fetch products from MySQL
        connection.query('SELECT * FROM products', (err, products) => {
            if (err) {
                console.error('Error fetching products:', err.stack);
                return res.status(500).json({ error: 'Failed to fetch products' });
            }

            // Render the admin dashboard with products and users
            res.render("admin", { products, users });
        });
    } catch (err) {
        console.error('Error fetching users or products:', err.stack);
        res.status(500).json({ error: 'Failed to fetch users or products' });
    }
});

// Product management routes
router.post('/products', adminAuth, createProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// User management routes
router.put("/users/:id", adminAuth, updateUser);
router.delete("/users/:id", adminAuth, deleteUser);

module.exports = router;
