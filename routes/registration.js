
const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('user/registration', {
        title: "Register an account"
    });
});

router.post('/', async (req, res) => {
    let { firstName, lastName, email,password} = req.body;
    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    password = xss(password);
    // street = xss(street);
    // profilePicture = xss(profilePicture);
    // house_number = xss(house_number);
    // city = xss(city);
    // state = xss(state);
    // pincode = xss(pincode);
    // age = xss(age);

    let error_msgs = [];
    try {
        await userData.getUserByEmail(email);
        res.render('user/registration', {
            found: "Email is already registered",
            hasEmail: true,
            title: "Register an account"
        });

    } catch (e) {
        if (!firstName) {
            error_msgs.push("Must provide first name.");
        }
        if (!lastName) {
            error_msgs.push("Must provide last name.");
        }
        if (!email) {
            error_msgs.push("Must provide valid email.");
        }
        if (!password) {
            error_msgs.push("Must provide valid password.")
        }
        // if (!street) {
        //     error_msgs.push("Must provide street.");
        // }
        // if (!house_number) {
        //     error_msgs.push("Must provide a number.");
        // }
        // if(!city){
        //     error_msgs.push("city.");
        // }
        // if(!state){
        //     error_msgs.push("state");
        // }
        // if(!pincode){
        //     error_msgs.push("pincode");
        // }
        // if (!age) {
        //     error_msgs.push("age");
        // }
        if (error_msgs.length !== 0) {
            res.render('user/registration', {
                error_messages: error_msgs,
                hasErrors: true,
                title: "Register an account"
            });
        } else
            try {
                await userData.addUser(
                    firstName,
                    lastName,
                    email,
                    password,
                    // street,
                    // profilePicture,
                    // house_number,
                    // city,
                    // state,
                    // pincode,
                    // age,
                );
                res.render('user/success', {title: "Account created"});
            } catch (e) {
                console.log(e);
                error_msgs.push("There was an error registering your account. Please try again later.")
                res.render('user/registration', {
                    title: "Register an account",
                    hasErrors: true,
                    error_messages: error_msgs
                });
            }

    }
});


module.exports = router;