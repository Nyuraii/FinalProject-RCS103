const router = require("express").Router();
const fs = require("fs");
const adminAuth = require("../middleware/adminAuth");
const User = require("../models/User");

const readProducts = () => {
    return JSON.parse(fs.readFileSync("./data/products.json"));
};

const writeProducts = (data) => {
    fs.writeFileSync("./data/products.json", JSON.stringify(data, null, 2));
};

// const readUsers = () => {
//     return JSON.parse(fs.readFileSync("./data/users.json"));
// };

// const writeUsers = (data) => {
//     fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 2));
// };

// Admin dashboard
router.get("/", adminAuth, async (req, res) => {
    const products = readProducts();
    const users = await User.find();
    res.render("admin", { products, users });
});

// Product management routes
router.post("/products", adminAuth, (req, res) => {
    const products = readProducts();
    const uniqueId = new Date();
    const date = new Date();
    const newProduct = {
        id: uniqueId.getTime(),
        createdAt: date,
        updatedAt: date,
        ...req.body,
    };
    products.push(newProduct);
    writeProducts(products);
    res.status(201).json(newProduct);
});

router.put("/products/:id", adminAuth, (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        const updatedProduct = {
            ...products[index],
            ...req.body,
            updatedAt: new Date()
        };
        products[index] = updatedProduct;
        writeProducts(products);
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

router.delete("/products/:id", adminAuth, (req, res) => {
    const products = readProducts();
    const index = products.findIndex(p => p.id == req.params.id);
    if (index !== -1) {
        const deletedProduct = products.splice(index, 1);
        writeProducts(products);
        res.json(deletedProduct);
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});

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
