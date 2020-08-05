const express = require("express");
const router = express.Router();
const house = require("../houseData");
const houseData = house.houseData;

router.get("/house", async (req, res) => {
  try {
    let allHouse = await houseData.getAllHouse();
    res.json(allHouse);
  } catch (error) {
    res.status(404).json({ error: "Houses not found" });
  }
});

router.get("/house/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "House Id missing" });
    return;
  }

  try {
    let house = await houseData.getHouseById(req.params.id);
    console.log(house);
    //res.json(house);
    //renderds the individual house page with the house info
    res.render("pages/individualHouse", {
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
    });
  } catch (error) {
    res.status(404).json({ error: "House not found" });
  }
});

router.post("/house", async (req, res) => {
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

router.put("/house/:id", async (req, res) => {
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

router.delete("/house/:id", async (req, res) => {
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

router.patch("/house/:id", async (req, res) => {
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

  return oldHouse;
}

module.exports = router;
