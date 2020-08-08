/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-07 16:20:41
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 21:03:25
 */
const express = require('express');
const router = express.Router();
const data = require('../userData');
const userData = data.users;

router.get('/', async (req, res) => {
    let userId = req.session.user;
    let user = await userData.getUserById(userId);
    console.log(user);
    res.render('pages/account', { title: "User Account", user: user });
  });


  module.exports = router;