const jwt = require('jsonwebtoken');

const handleTokenErrors = (err, req, res, next) => {
    if (err.name === 'TokenExpiredError') {
        console.log('Token expired, prompting user to log in again');
        return res.redirect('/users/login');
    }
    next(err);
};

module.exports = handleTokenErrors;
