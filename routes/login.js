const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userData = require('../data/users');
const xss = require('xss');

router.get('/', async (req, res) => {
    if (req.session.fromOtherPage === true) {
        req.session.fromOtherPage = null;
        res.render('user/login', {
            fromCoursePage: true,
            loginError: `You must be logged in to perform that action.`
        });
    } else {
        res.render('user/login',{title:"Log in"});
    }
});

router.post('/result', async (req, res) => {
    let { email, password } = req.body;
    email = xss(email);
    password = xss(password);
    email = email.toLowerCase();
    console.log(email);
    console.log(password);
    if (!email || !password) {
        console.log('error in first');
        return res.json({error: "You must provide a valid email and password."});
    }
    let userInfo;
    let passwordMatch = false;
    try {
        userInfo = await userData.getUserByEmail(email);
    } catch (e) {
        return res.json({error: "cannot find user info."});
    }
    try {
        passwordMatch = await bcrypt.compare(password, userInfo.hashedPassword);
    } catch (e) {
        console.log(e);
    }
    if (passwordMatch === false) {
        return res.json({error: "password is wrong."});
    } else {
        req.session.user = userInfo._id;
        res.render('user/success', {title: "log in succeed"});
    }
});

module.exports = router;