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
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "favourite Houses not found", 
      hasLogin: req.session.user
    });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "fav House Id missing", 
      hasLogin: req.session.user
    });
    return;
  }

  try {
    let favhouse = await favHouseData.getFavouriteHouseById(req.params.id);
    res.json(favhouse);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "House not found", 
      hasLogin: req.session.user
    });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply all fields.", 
      hasLogin: req.session.user
    });
    return;
  }

  if (!req.body["houseId"]) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply house id fields.", 
      hasLogin: req.session.user
    });
    return;
  }

  let newfavHouse = {};
  try {
    newfavHouse = await favHouseData.addFavouriteHouse(req.body["houseId"]);
    res.json(newfavHouse);
  } catch (error) {
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Cannot add new fav House", 
      hasLogin: req.session.user
    });
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
    res.status(404).render("pages/error", {
      title: "Error Page",
      error: "Must supply fav House Id." , 
      hasLogin: req.session.user
    });
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
        res.status(404).render("pages/error", {
          title: "Error Page",
          error: "Cannot delete fav House." , 
          hasLogin: req.session.user
        });
        return;
      }
      //delete fav house
      try {
        await favHouseData.deleteFavouriteHouse(favHouseId);
        res.sendStatus(200);
      } catch (error) {
        res.status(404).render("pages/error", {
          title: "Error Page",
          error: "Cannot delete  fav House." , 
          hasLogin: req.session.user
        });
      }
    }
  } catch (error) {
    console.log("error = " + error);
  }
});

module.exports = router;
