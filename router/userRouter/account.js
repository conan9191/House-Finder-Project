/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-07 16:20:41
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-08 08:16:32
 */
const express = require("express");
const router = express.Router();
const data = require("../../data/userData");
const userData = data.users;

router.get("/", async (req, res) => {
  let userId = req.session.user;
  console.log(userId);
  let user = await userData.getUserById(userId);
  console.log(user);
  res.render("pages/account", { title: "User Account", user: user, hasLogin: true });
});

module.exports = router;
