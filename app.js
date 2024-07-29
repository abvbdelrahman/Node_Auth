const express = require('express');
const cookieParser = require('cookie-parser');

const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const dotenv = require('dotenv');
const index = require('./Routes/index');
const users = require('./Routes/users');

const app = express();
//DB Config

const db = require('./config/keys').MongoURI;

// Connect to MongoDB

mongoose.connect(db, { useNewUrlParser: true })
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err));


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//BodyParser 
app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));

//Session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true  // saves uninitialized sessions to the store.
}));

//Flash middleware

app.use(flash());

// Global vars

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/',index);
app.use('/users',users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=> {
    console.log(`Server is running on port ${PORT}`);
});