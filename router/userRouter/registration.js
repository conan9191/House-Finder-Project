const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const data = require("../../data/userData");
const userData = data.users;

const xss = require("xss");

router.get("/", async (req, res) => {
  res.render("pages/registration", {
    title: "Register an account",
  });
});

router.post('/', async (req, res) => {
  let { firstName, lastName, email,password,street,profilepicturefile,house_number,city,state,pincode,age,profilepicture} = req.body;
  firstName = xss(firstName);
  lastName = xss(lastName);
  email = xss(email).toLowerCase();
  password = xss(password);
  street = xss(street);
  profilepicturefile = xss(profilepicturefile);
  house_number = xss(house_number);
  city = xss(city);
  state = xss(state);
  pincode = xss(pincode);
  age = xss(age);
  profilepicture = xss(profilepicture);
  let checkNumber = ['0','1','2','3','4','5','6','7','8','9'];

  let error_msgs = [];
  try {
    await userData.getUserByEmail(email);
    res.render('pages/registration', {
      found: "Email is already registered",
      hasEmail: true,
      title: "Register an account"
    });

  } catch (e) {
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

    if (!profilepicture ||!profilepicturefile) {
      error_msgs.push("Must provide profilepicture.");
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
      res.render('pages/registration', {
        error_messages: error_msgs,
        hasErrors: true,
        title: "Register an account"
      });
    } else
      try {
        const hashPassword = await bcrypt.hash(password, 5);

        await userData.addUser(
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
        try {
          userInfo = await userData.getUserByEmail(email);
        } catch (e) {
          return res.json({ error: "cannot find user info." });
        }
        console.log(userData._id);
        req.session.user = userInfo._id;
        res.render('pages/success', {title: "Account created", hasLogin: true});
      } catch (e) {
        console.log(e);
        error_msgs.push("There was an error registering your account. Please try again later.")
        res.render('pages/registration', {
          title: "Register an account",
          hasErrors: true,
          error_messages: error_msgs
        });
      }

  }
});

module.exports = router;
