const houseRoutes = require("./house");

const constructorMethod = (app) => {
  app.use("/", houseRoutes);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
