const router = require("express").Router();
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");
const { check, validationResult } = require("express-validator");

const readData = () => {
    return JSON.parse(fs.readFileSync("./data/users.json"));
};

const writeData = (data) => {
    fs.writeFileSync("./data/users.json", JSON.stringify(data, null, 2));
};

// Registration route
router.post("/register", [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const users = readData();
    const userExists = users.some(user => user.email === email || user.username === username);

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const newUser = {
        id: new Date().getTime(),
        username,
        email,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
    };

    users.push(newUser);
    writeData(users);

    const token = jwt.sign({ id: newUser.id, username: newUser.username, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: 3600 });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/');
});

// Login route
router.post("/login", [
    check('identifier', 'Username or email is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { identifier, password } = req.body;
    const users = readData();
    const user = users.find(user => user.email === identifier || user.username === identifier);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: 3600 });

    if (user.username === 'admin' && password === 'salam123') {
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');
    } else {
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/');
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect('/users/login');
});

router.get("/", adminAuth, (req, res) => {
    const users = readData();
    res.render("users", { users });
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/profile", auth, (req, res) => {
    const users = readData();
    const user = users.find(user => user.id === req.user.id);
    res.render("profile", { user });
});

module.exports = router;
