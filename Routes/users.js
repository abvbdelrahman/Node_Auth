const express = require('express');
const bcrypt = require('bcryptjs');
const createSendToken = require('../config/jwt');
const User = require('./../models/userModel');
const router = express.Router();

//login Page
router.get('/login', (req, res) => {
    res.render('login')
});

//register Page
router.get('/register', (req, res) => {
    res.render('register')
});

// Register Handle

router.post('/register', (req, res) => {
    // const newuser = await User.create({...req.body})
    const { name, email, password, password2} = req.body
    let errors = [];
    // check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill in all fields'});
    }
    // check password match
    if(password !== password2){
        errors.push({msg: 'Passwords do not match'});
    }
    // check password length
    if(password.length < 6){
        errors.push({msg: 'Password should be at least 6 characters long'});
    }
    if(errors.length > 0){
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // validation pass
        User.findOne({email})
       .then(user => {
        if(user){
            errors.push({msg: 'Email already exists'});
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
            });
        } else {
            const newUser = new User({name, email, password});
            // Hash password
            bcrypt.genSalt(10, (err, salt) => 
                bcrypt.hash(newUser.password,salt, (err, hash) => {
                    if(err) throw err;
                    // save hashed password
                    newUser.password = hash;
                    newUser.save()
                   .then((user) => {
                        req.flash('success_msg', 'You are registered and can now login');
                        res.redirect('/users/login');
                    })
                   .catch(err => console.log(err));
            }));
        }
       })
       .catch(err => console.log(err));
    }
});

//Login Handler
router.post('/login', (req, res, next) => {

        const { email, password } = req.body;
        // 1) Check if email and password exist
        if (!email ||!password) {
            return res.status(400).json({ msg: 'Please provide email and password!'});
        }
        
        // 2) check if user exists && password is correct
        User.findOne({ email }).select('+password')
         .then(user => {
            if (!user ||!(bcrypt.compareSync(password, user.password))) {
                return res.status(400).json( {msg: 'incorrect email or password'})
            }
            //3) check if everything is ok, send token to the client
            createSendToken(user, 200, req, res);
          })
         .catch(next);
         console.log();
});

// Log out handler

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/users/login');
});

module.exports = router;