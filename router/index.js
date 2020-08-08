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

  app.use("*", (req, res) => {
    const authenticated = req.session.user || false;
    res.render("pages/erroraccess", {
      title: "Access Error",
      authenticated: authenticated,
    });
  });
};

module.exports = constructorMethod;