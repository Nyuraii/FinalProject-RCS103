const router = require("express").Router();
const fs = require("fs");
const adminAuth = require("../middleware/adminAuth");

const readProducts = () => {
    return JSON.parse(fs.readFileSync("./data/products.json"));
};

const writeProducts = (data) => {
    fs.writeFileSync("./data/products.json", JSON.stringify(data, null, 2));
};

const readUsers = () => {
    return JSON.parse(fs.readFileSync("./data/users.json"));
};

const writeUsers = (data) => {
    fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 2));
};

// Admin dashboard
router.get("/", adminAuth, (req, res) => {
    const products = readProducts();
    const users = readUsers();
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
router.post("/users", adminAuth, (req, res) => {
    const users = readUsers();
    const uniqueId = new Date();
    const newUser = {
        id: uniqueId.getTime(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
    };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});

router.put("/users/:id", adminAuth, (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        const updatedUser = {
            ...users[index],
            ...req.body,
            updatedAt: new Date()
        };
        users[index] = updatedUser;
        writeUsers(users);
        res.json(updatedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

router.delete("/users/:id", adminAuth, (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.id == req.params.id);
    if (index !== -1) {
        const deletedUser = users.splice(index, 1);
        writeUsers(users);
        res.json(deletedUser);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

module.exports = router;
