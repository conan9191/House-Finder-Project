/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-17 10:22:47
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-21 01:45:29
 */
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const data = require("../../data/userData");
const userData = data.users;

const xss = require("xss");

router.get("/", async (req, res) => {
    let userId = req.session.user;
    if(!userId){
        res.render('pages/error', {
            error:"You must provide login user to update",
            title: "error page",
            hasLogin: req.session.user
        })
        return;
    }
    let user = {};
    if(userId){
        try {
            user = await userData.getUserById(userId);
        } catch (error) {
            console.log(error);
        }
    }
    res.render("pages/update", {
        hasLogin: true,
        user: user,
        title: "update an account",
    });
});

router.post('/', async (req, res) => {
    if (!req.body) {
        res.status(400).json({ error: "You must provide data to update" });
        return;
    }
    let user = {}
    let userId = req.session.user;
    if(!userId){
        res.render('pages/error', {
            error:"You must provide login user to update",
            title: "error page",
            hasLogin: req.session.user
        });
        return;
    }
    try {
        user = await userData.getUserById(userId);
    } catch (error) {
        res.status(404).json({ error: error });
    }
    let { firstName, lastName, email,password,street,house_number,city,state,pincode,age} = req.body;
    firstName = xss(firstName);
    lastName = xss(lastName);
    email = xss(email).toLowerCase();
    password = xss(password);
    street = xss(street);
    house_number = xss(house_number);
    city = xss(city);
    state = xss(state);
    pincode = xss(pincode);
    age = xss(age);
    let error_msgs = [];
    if (!firstName) {
        error_msgs.push("Must provide first name.");
    }else{
        let isletter = /^[a-zA-Z]+$/.test(firstName);
        if(isletter===false) error_msgs.push("Name must be all english letters")
    }

    if (!lastName) {
        error_msgs.push("Must provide last name.");
    }else{
        let isletter = /^[a-zA-Z]+$/.test(lastName);
        if(isletter===false) error_msgs.push("Name must be all english letters")
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

    if (!house_number) {
        error_msgs.push("Must provide a number.");
    }else{
        let isnumber = /^[0-9]+$/.test(house_number);
        if(isnumber===false) error_msgs.push("house number must be number")
    }

    if(!city){
        error_msgs.push("city.");
    }
    
    if(!state){
        error_msgs.push("state");
    }else{
        let isletter = /^[a-zA-Z]+$/.test(state);
        if(isletter===false) error_msgs.push("State name must be all english letters")
    }

    if(!pincode){
        error_msgs.push("pincode");
    }else{
        let isnumber = /^[0-9]+$/.test(pincode);
        if(isnumber===false) error_msgs.push("pincode must be number")
    }

    if (!age) {
        error_msgs.push("age");
    }else{
        let isnumber = /^[0-9]+$/.test(age);
        if(isnumber===false) error_msgs.push("age must be number")
    }

    if (error_msgs.length !== 0) {
        res.render('pages/update', {
            error_messages: error_msgs,
            hasErrors: true,
            title: "update an account",
            user: user,
            hasLogin: true
        })
        return;
    }
    try {
        const hashPassword = await bcrypt.hash(password, 5);
        let updateOnes = await userData.updateLoginUser(
            (user._id).toString(),
            firstName,
            lastName,
            email,
            hashPassword,
            street,
            user.profilePicture,
            house_number,
            city,
            state,
            pincode,
            age
        );
    } catch (e) {
        res.status(404).json({ error: e });
    }
    res.redirect("/account");

});

module.exports = router;
