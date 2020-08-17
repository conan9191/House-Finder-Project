/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-07 19:47:07
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-08 10:46:15
 */
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  req.session.cookie.expires = new Date(new Date().getTime - 60).getTime();
  req.session.destroy();
  res.render("pages/logout", { title: "Log Out"});
});

module.exports = router;
