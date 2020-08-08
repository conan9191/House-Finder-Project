const dbCollections = require("../../settings/collections");

const favouriteCollectionObj = dbCollections.favourite;
const { v1: uuidv4 } = require("uuid");

let favouriteData = {
  _id: "",
  houseId: "",
};

/**
 * Find Favourite into Favourite database for given id
 * @param {} id : Favourite id
 * Return : If Favourite for given id is not found , error is thrown. Else return Favourite object with complete data.
 */
async function getFavouriteHouseById(id) {
  id = getValidId(id);
  let favouriteObj = await favouriteCollectionObj();

  let favData = await favouriteObj.findOne({ _id: id });

  if (favData === null) {
    throw `Error :Cannot find fav house with given id : ${id} into database`;
  }

  return favData;
}

/**
 * Return all houses stored in database House.
 */
async function getAllFavouriteHouse() {
  const favouriteObj = await favouriteCollectionObj();
  const allfavData = await favouriteObj.find().toArray();

  if (allfavData === null) {
    throw `No favourite house found in database`;
  }
  return allfavData;
}

/**
 * Add new fav house into database.
 * firstly, Validate favourite house id information pass from post router.
 * If invalid info is found an array of error is thrown.
 * Secondly, Create schema with new fav house info.
 *
 * @param {*} houseInfo : fav house object that contains req.body from post router.
 * Return : New fav house data added in database.
 */
async function addFavouriteHouse(houseId) {
  if (!houseId) {
    throw `Must provide house id to add favourite house details in database`;
  }

  favouriteData.houseId = houseId;

  let favhouseSchema = {
    _id: uuidv4(),
    houseId: favouriteData.houseId,
  };

  let favObj = await favouriteCollectionObj();

  let newfavHouse = await favObj.insertOne(favhouseSchema);

  if (newfavHouse.insertedCount === 0) {
    throw `Error : Unable to add new fav house into database`;
  }

  return await this.getFavouriteHouseById(newfavHouse.insertedId);
}

/**
 * Delete fav house info from database.
 *
 * @param {*} id : fav house id that contains req.param.id from Delete router.
 * Return : true if deleted successfully else error will be thrown.
 */
async function deleteFavouriteHouse(id) {
  id = getValidId(id);

  let favhouseObj = await favouriteCollectionObj();

  let removedfavHouse = await favhouseObj.removeOne({ _id: id });

  if (removedfavHouse.deletedCount === 0) {
    throw `Error : Unable to delete house with id : ${id} from database`;
  }

  return true;
}

/**
 * Return favourite house id for given house id.
 * @param {*} houseId : for which want to obtain favhouse id.
 */
async function getFavHouseByHouseId(houseId) {
  houseId = getValidId(houseId);

  let favouriteObj = await favouriteCollectionObj();

  let favData = await favouriteObj.findOne({ houseId: houseId });

  if (favData === null) {
    throw `Error :Cannot find fav house with given id : ${id} into database`;
  }

  return favData;
}

/**
 * Check and validate ID .
 * @param {} id : ID to be validate
 */
function getValidId(id) {
  if (!id) {
    throw "Given  id is invalid";
  }

  if (typeof id != "object" && typeof id != "string") {
    throw "Provide  id of type object or string ";
  }

  return id;
}

module.exports = {
  getAllFavouriteHouse,
  getFavouriteHouseById,
  addFavouriteHouse,
  deleteFavouriteHouse,
  getFavHouseByHouseId,
};
