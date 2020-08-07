const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const userData = require('../data/users');
const xss = require('xss');



router.get('/', async (req, res) => {
    if (req.session.fromOtherPage === true) {
        req.session.fromOtherPage = null;
        res.render('login', {
            fromCoursePage: true,
            loginError: `You must be logged in to perform that action.`
        });
    } else {
        res.render('login',{title:"Log in"});
    }
});

router.post('/result', async (req, res) => {
    let { email, password } = req.body;
    email = xss(email);
    password = xss(password);
    email = email.toLowerCase();
    console.log(email);
    if (!email || !password) {
        console.log('error in first');
        return res.json({error: "You must provide a valid email and password."});
    }
    let userInfo;
    let passwordMatch = false;
    try {
        userInfo = await userData.getUserByEmail(email);
    } catch (e) {
        return res.json({error: "Invalid email and/or password."});
    }
    try {
        passwordMatch = await bcrypt.compare(password, userInfo.hashedPassword);
    } catch (e) {
        console.log(e);
    }
    if (passwordMatch === false) {
        return res.json({error: "Invalid email and/or password."});
    } else {
        req.session.user = userInfo._id;
        res.redirect("/");
    }
});

module.exports = router;