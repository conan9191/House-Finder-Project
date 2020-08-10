/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-08 14:15:11
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-08 14:17:36
 */
let createError = require("http-errors");
const express = require("express");
let path = require("path");
let cookieParser = require("cookie-parser");
let logger = require("morgan");
const app = express();
const static = express.static(__dirname + '/public');
const exphbs = require("express-handlebars");
const session = require("express-session");

const configRoutes = require("./router/index");

// view engine setup
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use('/public', static);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/public", express.static(path.join(__dirname, "/public")));

// Middleware

app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(async (req, res, next) => {
  let currTimeStamp = new Date().toUTCString();
  let userAuth = "(Non-Authenticated User)";
  if (req.session.user) {
    userAuth = "(Authenticated User)";
  }
  console.log(
    `[${currTimeStamp}]: ${req.method} ${req.originalUrl} ${userAuth}`
  );
  next();
});

app.use("/login", async (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

app.use("/logout", async (req, res, next) => {
  if (!req.session.user) {
    req.session.fromOtherPage = true;
    return res.redirect("/login");
  } else {
    next();
  }
});

app.use("/registration", async (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    next();
  }
});

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
