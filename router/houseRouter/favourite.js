const express = require("express");
const router = express.Router();
const house = require("../../data/houseData");
const favHouseData = house.favHouseData;

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

  try {
    let newfavHouse = await favHouseData.addFavouriteHouse(req.body["houseId"]);
    res.json(newfavHouse);
  } catch (error) {
    res.status(404).json({ error: "Cannot add new fav House" });
  }
});

router.delete("/:id", async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: "Must supply fav House Id." });
    return;
  }

  try {
    await favHouseData.getFavouriteHouseById(req.params.id);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete fav House." });
    return;
  }

  try {
    await favHouseData.deleteFavouriteHouse(req.params.id);
    res.sendStatus(200);
  } catch (error) {
    res.status(404).json({ error: "Cannot delete  fav House." });
  }
});

module.exports = router;
