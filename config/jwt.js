const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const keys = require('./keys');
const User = require('../models/userModel');

const signToken = id => {
    return jwt.sign({ id }, keys.JWT_SECRET, { expiresIn: '1h' });
};

const createSendToken = (user, statusCode, req, res) => {
    const token = signToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, secure: false, maxAge: 3600000 });

    // Send the response by redirecting only
    res.redirect('/dashboard');
};

module.exports = createSendToken;