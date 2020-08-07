/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-07 16:20:41
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 16:23:07
 */
const express = require('express');
const router = express.Router();
const data = require('../userData');
const userData = data.users;

router.get('/:id', async (req, res) => {

    let user = await userData.getUserById(req.params.id);
    res.render('pages/account', { title: "User Account", user: user });
  });


  module.exports = router;