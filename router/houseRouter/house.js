const express = require("express");
const router = express.Router();
const house = require("../../data/houseData");
const houseData = house.houseData;
const user = require("../../data/userData");
const userData = user.users;

router.get("/", async (req, res) => {
  try {
    let houseList = await houseData.getAllHouse();
    
    //console.log(houseList);
    res.render("pages/mainPage", {
      title: "Main Page",
      list: houseList,
    });
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

router.get("/search", async (req, res) => {
  //the user shouldn't be able to manually enter this page
  res.redirect("/");
});

router.post("/search", async (req, res) => {
  //this route will display the houses that match the search criteria
  try {
    let info = await req.body;
    let searchList = await houseData.filterList(info);

    res.render("pages/houseList", {
      title: "Matched Houses",
      list: searchList,
    });
  } catch (e) {
    res.status(500);
    res.render("pages/error", {
      message: e,
    });
  }
});

router.get("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "House Id missing" });
    return;
  }

  let isFavHouse = false;
  let user = await userData.getUserById(req.session.user);
  if (user) {
    let userFavHouse = user["favourites"];
    if (userFavHouse) {
      let filterHouse = userFavHouse.filter(function (houseObj) {
        return houseObj.houseId === req.params.id;
      });
      // console.log("filterHouse = " + filterHouse);
      // console.log("filterHouse = " + filterHouse.length);

      if (filterHouse.length > 0) {
        isFavHouse = true;
      }
      // console.log("isFavHouse = " + isFavHouse);
    }
  }

  try {
    let house = await houseData.getHouseById(req.params.id);
    console.log(house);

    //Determine if a user is logged in and favorited
    let hasFav = false;
    let user = {};
    if(req.session.user){
      hasLogin = true;
      try{
        user = await userData.getUserById(req.session.user);
      }catch(error){
        res.status(404).json({ error: "User not found" });
        return; 
      }
      for(let i of user.favourites){
        if(i["houseId"] === req.params.id)
        hasFav = true;
        break;
      }
    }
    
    //res.json(house);
    //renderds the individual house page with the house info
    res.render("pages/individualHouse", {
      houseId: house._id,
      isFavHouse: isFavHouse,
      latitude: house.latitude,
      longitude: house.longitude,
      title: "Individual House Page",
      houseImage: house.profilePicture,
      houseNumber: house.houseNumber,
      street: house.street,
      city: house.city,
      state: house.state,
      zip: house.pincode,
      rent: house.rent,
      startDate: house.startDate,
      endDate: house.endDate,
      description: house.description,
      amenities: house.otherAmenities,
      pet: house.petFriendly,
      park: house.parkingAvailable,
      hasFav: hasFav,
      hasLogin: req.session.user
    });
  } catch (error) {
    res.status(404).json({ error: "Could not find house" });
  }
});

router.post("/", async (req, res) => {
  if (!req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  let houseParamBody = req.body;
  try {
    let newHouse = await houseData.addHouse(houseParamBody);
    res.json(newHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot add new House" });
  }
});

router.put("/:id", async (req, res) => {
  if (!req.params.id || !req.body) {
    res.status(404).json({ error: "Must supply all fields." });
    return;
  }

  let houseParamBody = req.body;
  let houseId = req.params.id;

  try {
    await houseData.getHouseById(houseId);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }

  try {
    let updateHouse = await houseData.updateHouse(houseId, houseParamBody);
    res.json(updateHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "Must supply House Id." });
    return;
  }

  try {
    await houseData.getHouseById(req.params.id);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete House." });
    return;
  }

  try {
    await houseData.deleteHouse(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete House." });
  }
});

router.patch("/:id", async (req, res) => {
  if (!req.params.id || !req.body || Object.keys(req.body).length === 0) {
    res.status(404).json({
      error: "Must provide atleast one field in request body.",
    });
    return;
  }

  let newHouse = req.body;
  let oldHouse = "";
  try {
    oldHouse = await houseData.getHouseById(req.params.id);
    oldHouse = checkAndUpdate(newHouse, oldHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }

  try {
    let updateHouse = await houseData.updateHouse(req.params.id, oldHouse);
    res.json(updateHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot update House." });
  }
});

function checkAndUpdate(newHouse, oldHouse) {
  if (
    newHouse.profilePicture &&
    newHouse.profilePicture != oldHouse.profilePicture
  ) {
    oldHouse.profilePicture = newHouse.profilePicture;
  }

  if (newHouse.longitude && newHouse.longitude != oldHouse.longitude) {
    oldHouse.longitude = newHouse.longitude;
  }
  if (newHouse.latitude && newHouse.latitude != oldHouse.latitude) {
    oldHouse.latitude = newHouse.latitude;
  }

  if (newHouse.street && newHouse.street != oldHouse.street) {
    oldHouse.street = newHouse.street;
  }

  if (newHouse.houseNumber && newHouse.houseNumber != oldHouse.houseNumber) {
    oldHouse.houseNumber = newHouse.houseNumber;
  }
  if (newHouse.city && newHouse.city != oldHouse.city) {
    oldHouse.city = newHouse.city;
  }

  if (newHouse.state && newHouse.state != oldHouse.state) {
    oldHouse.state = newHouse.state;
  }

  if (newHouse.pincode && newHouse.pincode != oldHouse.pincode) {
    oldHouse.pincode = newHouse.pincode;
  }
  if (newHouse.rent && newHouse.rent != oldHouse.rent) {
    oldHouse.rent = newHouse.rent;
  }

  if (newHouse.startDate && newHouse.startDate != oldHouse.startDate) {
    oldHouse.startDate = newHouse.startDate;
  }

  if (newHouse.endDate && newHouse.endDate != oldHouse.endDate) {
    oldHouse.endDate = newHouse.endDate;
  }
  if (
    newHouse.otherAmenities &&
    newHouse.otherAmenities != oldHouse.otherAmenities
  ) {
    oldHouse.otherAmenities = newHouse.otherAmenities;
  }
  if (newHouse.description && newHouse.description != oldHouse.description) {
    oldHouse.description = newHouse.description;
  }

  if (newHouse.petFriendly && newHouse.petFriendly != oldHouse.petFriendly) {
    oldHouse.petFriendly = newHouse.petFriendly;
  }
  if (
    newHouse.parkingAvailable &&
    newHouse.parkingAvailable != oldHouse.parkingAvailable
  ) {
    oldHouse.parkingAvailable = newHouse.parkingAvailable;
  }

  if (newHouse.houseType && oldHouse.houseType) {
    let newhouseType = newHouse.houseType;
    let oldhouseType = oldHouse.houseType;

    if (newhouseType.type && newhouseType.type != oldhouseType.type) {
      oldHouse.houseType.type = newhouseType.type;
    }
    if (newhouseType.bedroom && newhouseType.bedroom != oldhouseType.bedroom) {
      oldHouse.houseType.bedroom = newhouseType.bedroom;
    }
    if (newhouseType.hall && newhouseType.hall != oldhouseType.hall) {
      oldHouse.houseType.hall = newhouseType.hall;
    }
    if (newhouseType.kitchen && newhouseType.kitchen != oldhouseType.kitchen) {
      oldHouse.houseType.kitchen = newhouseType.kitchen;
    }
    if (
      newhouseType.bathroom &&
      newhouseType.bathroom != oldhouseType.bathroom
    ) {
      oldHouse.houseType.bathroom = newhouseType.bathroom;
    }
  }

  return oldHouse;
}

module.exports = router;
