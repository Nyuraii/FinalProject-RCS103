require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const adminAuth = require("./middleware/adminAuth");

const app = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const basketRoutes = require("./routes/basketRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Middleware to add user data to locals for every request
app.use((req, res, next) => {
    res.locals.user = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET) : null;
    next();
});

app.get("/", (req, res) => {
    res.render("index");
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/baskets", basketRoutes);
app.use("/admin", adminAuth, adminRoutes);

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
