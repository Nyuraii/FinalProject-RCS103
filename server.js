require('dotenv').config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const auth = require("./middleware/auth");
const adminAuth = require("./middleware/adminAuth");
const connectDB = require('./config/mongoConnection'); 
const methodOverride = require('method-override');
require('./config/mysqlConnection');
const createProductTable = require('./models/productModel');
const createFavoriteTable = require('./models/favoriteModel');
const createBasketTable = require('./models/basketModel');

const app = express();

connectDB();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            res.locals.user = decoded;
            req.user = decoded;
        } catch (err) {
            res.locals.user = null;
            req.user = null;
        }
    } else {
        res.locals.user = null;
        req.user = null;
    }
    next();
});

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const basketRoutes = require("./routes/basketRoutes");
const adminRoutes = require("./routes/adminRoutes");

// // Middleware to add user data to locals for every request
// app.use((req, res, next) => {
//     res.locals.user = req.cookies.token ? jwt.verify(req.cookies.token, process.env.JWT_SECRET) : null;
//     next();
// });


app.get("/", (req, res) => {
    res.render("index");
});

app.use("/products", productRoutes);
app.use("/users", userRoutes);
app.use("/favorites", favoriteRoutes);
app.use("/baskets", basketRoutes);
app.use("/admin", adminAuth, adminRoutes);

createProductTable();
createFavoriteTable();
createBasketTable();

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
});
