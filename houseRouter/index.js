const houseRoutes = require("./house");
const favRoutes = require("./favourite");

const constructorMethod = (app) => {
  app.use("/favourite", favRoutes);
  app.use("/house", houseRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
