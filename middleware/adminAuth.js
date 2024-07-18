const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/users/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.username === 'admin') {
            req.user = decoded;
            next();
        } else {
            res.redirect('/users/login');
        }
    } catch (err) {
        res.redirect('/users/login');
    }
};

module.exports = adminAuth;
