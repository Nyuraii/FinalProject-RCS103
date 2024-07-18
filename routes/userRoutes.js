const express = require("express");
const { check, validationResult } = require("express-validator");
const { registerUser, loginUser, getUserProfile, getAllUsers } = require("../controllers/userController");
const auth = require("../middleware/auth");
const adminAuth = require("../middleware/adminAuth");

const router = express.Router();

// Registration route
router.post("/register", [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, registerUser);

// Login route
router.post("/login", [
    check('identifier', 'Username or email is required').not().isEmpty(),
    check('password', 'Password is required').exists()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, loginUser);

router.get("/logout", (req, res) => {
    res.clearCookie('token');
    res.redirect('/users/login');
});

router.get("/", adminAuth, getAllUsers);

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/profile", auth, getUserProfile);

module.exports = router;
