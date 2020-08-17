const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const data = require("../../data/userData");
const userData = data.users;

const xss = require("xss");

router.get("/", async (req, res) => {

    res.render("pages/update", {
        title: "update an account",
    });
});

router.post('/', async (req, res) => {
    let { firstName, lastName, email,password,street, profilepicture,house_number,city,state,pincode,age} = req.body;
    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email);
    password = xss(password);
    street = xss(street);
    profilepicture = xss(profilepicture);
    house_number = xss(house_number);
    city = xss(city);
    state = xss(state);
    pincode = xss(pincode);
    age = xss(age);
    let error_msgs = [];
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
    if (!street) {
        error_msgs.push("Must provide street.");
    }
    if (!profilepicture) {
        error_msgs.push("Must provide profilepicture.");
    }
    if (!house_number) {
        error_msgs.push("Must provide a number.");
    }
    if(!city){
        error_msgs.push("city.");
    }
    if(!state){
        error_msgs.push("state");
    }
    if(!pincode){
        error_msgs.push("pincode");
    }
    if (!age) {
        error_msgs.push("age");
    }
    if (error_msgs.length !== 0) {
        res.render('pages/update', {
            error_messages: error_msgs,
            hasErrors: true,
            title: "update an account"
        })
    }
    try {
        let user = {}

        user = await userData.getUserByEmail(email);
        const hashPassword = await bcrypt.hash(password, 5);
        let updateOnes = await userData.updateUser(
            user._id.toString(),
            firstName,
            lastName,
            email,
            hashPassword,
            street,
            profilepicture,
            house_number,
            city,
            state,
            pincode,
            age
        );
        req.session.cookie.expires = new Date(new Date().getTime - 60).getTime();
        req.session.destroy();
        res.render("pages/login", { title: "Log in" });

    } catch (e) {

        console.log(e);
    }


});

module.exports = router;
