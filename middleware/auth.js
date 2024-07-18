const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/users/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/users/login');
    }
};

module.exports = auth;
