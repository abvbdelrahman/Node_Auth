const jwt = require('jsonwebtoken');
const keys = require('./keys');
module.exports = {
  ensureAuthenticated: function(req, res, next) {
    const token = req.cookies.jwt;

    if (!token) {
      req.flash('error_msg', 'You are not logged in');
      return res.redirect('/users/login');
    }

    try {
      const decoded = jwt.verify(token, keys.JWT_SECRET);
      req.user = decoded.user;
      next();
    } catch (err) {
      req.flash('error_msg', 'Invalid token');
      res.redirect('/users/login');
    }
  }
};
