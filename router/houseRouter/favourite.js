const express = require("express");
const router = express.Router();
const house = require("../../data/houseData");
const favHouseData = house.favHouseData;
const user = require("../../data/userData");
const userData = user.users;

router.get("/", async (req, res) => {
  try {
    let allfavHouse = await favHouseData.getAllFavouriteHouse();
    res.json(allfavHouse);
  } catch (error) {
    res.status(404).json({ error: "favourite Houses not found" });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "fav House Id missing" });
    return;
  }

  try {
    let favhouse = await favHouseData.getFavouriteHouseById(req.params.id);
    res.json(favhouse);
  } catch (error) {
    res.status(404).json({ error: "House not found" });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  if (!req.body["houseId"]) {
    res.status(404).json({ error: "Must supply house id fields." });
    return;
  }

  let newfavHouse = {};
  try {
    newfavHouse = await favHouseData.addFavouriteHouse(req.body["houseId"]);
    res.json(newfavHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot add new fav House" });
  }

  // Add favouriteId in user
  let loginUser = {};
  try {
    let userId = req.session.user;
    try {
      loginUser = await userData.getUserById(userId);
    } catch (error) {
      console.log(error);
    }
    let userFavHouse = [];
    if (loginUser["favourites"]) {
      userFavHouse = loginUser["favourites"];
    }
    userFavHouse.push(newfavHouse);
    await userData.updateUser(userId, loginUser);
  } catch (error) {
    console.log("update failure");
    console.log(error);
  }
});

//pass house id to delete favourite house for given houseid from fav collection and user fav list
router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "Must supply fav House Id." });
    return;
  }

  let favHouseId = "";

  //obtain favouritehouse id from given house id from user favhouse list
  //delete that from user fav list.
  try {
    let user = await userData.getUserById(req.session.user);
    if (user) {
      let userFavHouse = user["favourites"];
      if (userFavHouse) {
        let filterHouse = userFavHouse.filter(function (houseObj) {
          return houseObj.houseId === req.params.id;
        });

        if (filterHouse.length > 0) {
          let favHouse = filterHouse[0];
          favHouseId = favHouse["_id"];
          for (let i of userFavHouse) {
            let index = userFavHouse.indexOf(i);
            if (i["_id"] === favHouseId) {
              console.log(true);
              user["favourites"].splice(index, 1);
              break;
            }
          }
          await userData.updateUser(req.session.user, user);
        }
      }

      //check if fav house id exsist
      try {
        await favHouseData.getFavouriteHouseById(favHouseId);
      } catch (error) {
        res.status(404).json({ error: "Cannot delete fav House." });
        return;
      }
      //delete fav house
      try {
        await favHouseData.deleteFavouriteHouse(favHouseId);
        res.sendStatus(200);
      } catch (error) {
        res.status(404).json({ error: "Cannot delete  fav House." });
      }
    }
  } catch (error) {
    console.log("error = " + error);
  }
});

module.exports = router;
