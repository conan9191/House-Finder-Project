/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-11 19:54:39
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-12 23:41:44
 */
// const houseconstructorMethod = require("./userRouter/index");
// const userconstructorMethod = require("./houseRouter/index");

// const constructorMethod = (app) => {
//   houseconstructorMethod.houseconstructorMethod;
//   userconstructorMethod.userconstructorMethod;
// };

// module.exports = constructorMethod;

const loginRoutes = require("./userRouter/login");
const registrationRoutes = require("./userRouter/registration");
const userRoutes = require("./userRouter/users");
const logoutRoutes = require("./userRouter/logout");
const accountRoutes = require("./userRouter/account");
const parser = require("body-parser");
const houseRoutes = require("./houseRouter/house");
const favRoutes = require("./houseRouter/favourite");
const commentRoutes = require("./commentsAndReviewRouter/comments");
const reviewRoutes = require("./commentsAndReviewRouter/reviews");

const constructorMethod = (app) => {
  //for user
  app.use(parser.json());
  app.use("/users", userRoutes);

  //registration
  app.use("/account", accountRoutes);
  app.use("/login", loginRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/registration", registrationRoutes);

  //house
  app.use("/favourite", favRoutes);
  app.use("/house", houseRoutes);

  //comment
  app.use("/comment", commentRoutes);

  //review
  app.use("/review", reviewRoutes);

  app.use("*", (req, res) => {
    const authenticated = req.session.user || false;
    if (req.session.user) {
      res.render("pages/success", {
        title: "log in succeed",
        hasLogin: true,
      });
    } else {
      res.render("pages/erroraccess", {
        title: "Access Error",
        authenticated: authenticated,
      });
    }
  });
};

module.exports = constructorMethod;
