const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminAuth = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.username === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = adminAuth;
