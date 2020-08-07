
const express = require('express');
const router = express.Router();
const userData = require('../data/users');
const xss = require('xss');

router.get('/', async (req, res) => {
    res.render('registration', {
        title: "Register an account"
    });
});

router.post('/', async (req, res) => {
    let { firstName, lastName, email, profilePicture, street, house_number, city, state, pincode,age,password} = req.body;
    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    profilePicture = xss(profilePicture);
    street = xss(street);
    house_number = xss(house_number);
    city = xss(city);
    state = xss(state);
    pincode = xss(pincode);
    age = xss(age);
    password = xss(password);
    email = email.toLowerCase();
    let error_msgs = [];
    try {
        await userData.getUserByEmail(email);
        res.render('registration', {
            found: "Email is already registered",
            hasEmail: true,
            title: "Register an account"
        });

    } catch (e) {
        checkIsProperString(firstName, "firstName");
        checkIsProperString(lastName, "lastName");
        checkIsProperString(email, "email");
        checkIsProperString(profilePicture, "profilePicture");
        checkIsProperString(street, "street");
        checkIsProperString(house_number, "house number");
        checkIsProperString(city, "city");
        checkIsProperString(state, "state");
        checkIsProperString(pincode, "pincode");
        checkIsProperString(age, "age");
        checkIsProperString(Password, "hashedPassword");
        if (error_msgs.length !== 0) {
            res.render('registration', {
                error_messages: error_msgs,
                hasErrors: true,
                title: "Register an account"
            });
        } else {
            try {
                await userData.addUser(
                    firstName,
                    lastName,
                    email,
                    profilePicture,
                    street,
                    house_number,
                    city,
                    state,
                    pincode,
                    age,
                    password
                );
                res.render('registersuccess', {title: "Account created"});
            } catch (e) {
                console.log(e);
                error_msgs.push("There was an error registering your account. Please try again later.")
                res.render('registration', {
                    title: "Register an account",
                    hasErrors: true,
                    error_messages: error_msgs
                });
            }
        }
    }
});

function checkIsProperString(val, variableName) {
    if(!val) throw `You must provide a ${variableName || 'provided variable'} for the user`;
    if (typeof val !== 'string') throw `${variableName || 'provided variable'} is not a string`;
    if (val.length === 0) throw `${variableName || 'provided variable'} is null`;
}

module.exports = router;