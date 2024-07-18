const router = require("express").Router();
const fs = require("fs");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");
const { createProduct, updateProduct, deleteProduct } = require('../controllers/productController');



// Admin dashboard
router.get("/", adminAuth, async (req, res) => {
    const users = await User.find();
    res.render("admin", { products, users });
});

// Product management routes
router.post('/products', adminAuth, createProduct);
router.put('/products/:id', adminAuth, updateProduct);
router.delete('/products/:id', adminAuth, deleteProduct);

// User management routes
router.post("/users", adminAuth, async (req, res) => {
    const { username, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        role,
        createdAt: new Date(),
        updatedAt: new Date()
    });
    await newUser.save();
    res.status(201).json(newUser);
});

router.put("/users/:id", adminAuth, async (req, res) => {
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            username,
            email,
            role,
            updatedAt: new Date()
        },
        { new: true }
    );
    if (updatedUser) {
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

router.delete("/users/:id", adminAuth, async (req, res) => {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (deletedUser) {
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = router;
