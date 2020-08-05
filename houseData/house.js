/** moment : library to validate date
 * is_image_url : library to validate image url for house profile picture
 */
const moment = require("moment");
const is_image_url = require("is-image-url");

const dbCollections = require("../settings/collections");
const houseCollectionObj = dbCollections.house;
const houseTypeCollectionObj = dbCollections.houseType;
const { v1: uuidv4 } = require("uuid");

/**
 * houseData : house object to store and validate house data.
 */
let houseData = {
  _id: "",
  profilePicture: "",
  street: "",
  houseNumber: "",
  city: "",
  state: "",
  pincode: "",
  longitude: "",
  latitude: "",
  rent: "",
  startDate: "",
  endDate: "",
  houseTypes: {},
  petFriendly: "",
  otherAmenities: "",
  description: "",
  parkingAvailable: "",
  reviewIds: [],
};

/**
 * Find house into house database for given id
 * @param {} id : House id
 * Return : If house for given id is not found , error is thrown. Else return house object with complete data.
 */
async function getHouseById(id) {
  id = getValidId(id);
  let houseObj = await houseCollectionObj();

  let houseData = await houseObj.findOne({ _id: id });

  if (houseData === null) {
    throw `Error :Cannot find house with given id : ${id} into database`;
  }

  return houseData;
}

/**
 * Return all houses stored in database House.
 */
async function getAllHouse() {
  const houseObj = await houseCollectionObj();
  const allHouseData = await houseObj.find().toArray();

  if (allHouseData === null) {
    throw `No house found in database`;
  }
  return allHouseData;
}

/**
 * Add new house into database.
 * firstly, Validate house information pass from post router.
 * If invalid info is found an array of error is thrown.
 * Secondly, Create schema with new house info.
 *
 * @param {*} houseInfo : house object that contains req.body from post router.
 * Return : New house data added in database.
 */
async function addHouse(houseInfo) {
  let data = validateCompleteHouseInfo(houseInfo);
  if (data != null) {
    let houseSchema = createHouseSchema(data, false);
    let houseObj = await houseCollectionObj();

    let newHouse = await houseObj.insertOne(houseSchema);

    if (newHouse.insertedCount === 0) {
      throw `Error : Unable to add new house into database`;
    }

    return await this.getHouseById(newHouse.insertedId);
  }

  throw `Error : Unable to add new house into database`;
}

/**
 * Update house info into database.
 * firstly, Validate house information pass from Put/Patch router.
 * If invalid info is found an array of error is thrown.
 * Secondly, Create schema with updated house info.
 *
 * @param {*} updateHouseInfo : house object that contains req.body from Put/Patch router.
 * @param {*} houseId : house id that contains req.param.id from Put/Patch router.
 * Return : Updated house data from database.
 */
async function updateHouse(houseId, updateHouseInfo) {
  houseId = getValidId(houseId);
  let data = validateCompleteHouseInfo(updateHouseInfo);

  if (data != null) {
    let houseSchema = createHouseSchema(data, true);
    let houseObj = await houseCollectionObj();
    let updateHouse = await houseObj.updateOne(
      { _id: houseId },
      { $set: houseSchema }
    );
    if (!updateHouse.modifiedCount && !updateHouse.matchedCount) {
      throw `Error : Unable to update house with id : ${houseId} into database`;
    }
    return await this.getHouseById(houseId);
  }
  throw `Error : Unable to update house with id : ${id} into database`;
}

/**
 * Delete house info from database.
 *
 * @param {*} id : house id that contains req.param.id from Delete router.
 * Return : true if deleted successfully else error will be thrown.
 */
async function deleteHouse(id) {
  id = getValidId(id);

  let houseObj = await houseCollectionObj();

  let removedHouse = await houseObj.removeOne({ _id: id });

  if (removedHouse.deletedCount === 0) {
    throw `Error : Unable to delete house with id : ${id} from database`;
  }

  return true;
}

/**
 * Check if house information exsist, validate and store them in houseData object.
 * Else add error in error Array.
 * @param {*} houseInfo  : House information object
 * Return : If errorArray contains error throw error.
 * Else return house data object with valid information.
 */
function validateCompleteHouseInfo(houseInfo) {
  let errorArray = [];

  if (houseInfo) {
    //profile picture
    if (
      houseInfo["profilePicture"] &&
      typeof houseInfo["profilePicture"] == "string" &&
      is_image_url(houseInfo["profilePicture"])
    ) {
      houseData.profilePicture = houseInfo["profilePicture"];
    } else {
      errorArray.push("Invalid House profile picture url.");
    }

    //longitude and latitude
    if (
      houseInfo["longitude"] &&
      houseInfo["latitude"] &&
      isValidLatitudeandLongitude(houseInfo["longitude"], houseInfo["latitude"])
    ) {
      houseData.longitude = houseInfo["longitude"];
      houseData.latitude = houseInfo["latitude"];
    } else {
      errorArray.push("Missing House longitude/longitude or missing value.");
    }

    //street
    if (houseInfo["street"] && typeof houseInfo["street"] == "string") {
      houseData.street = houseInfo["street"];
    } else {
      errorArray.push("Invalid House street or missing value.");
    }

    //house number
    if (
      houseInfo["houseNumber"] &&
      typeof houseInfo["houseNumber"] == "string"
    ) {
      houseData.houseNumber = houseInfo["houseNumber"];
    } else {
      errorArray.push("Invalid House Number or missing value.");
    }

    //city
    if (houseInfo["city"] && typeof houseInfo["city"] == "string") {
      houseData.city = houseInfo["city"];
    } else {
      errorArray.push("Invalid House city or missing value.");
    }

    //state
    if (houseInfo["state"] && typeof houseInfo["state"] == "string") {
      houseData.state = houseInfo["state"];
    } else {
      errorArray.push("Invalid House state or missing value.");
    }

    //pincode
    if (houseInfo["pincode"] && !isNaN(houseInfo["pincode"])) {
      houseData.pincode = houseInfo["pincode"];
    } else {
      errorArray.push("Invalid House pincode or missing value.");
    }

    //rent
    if (houseInfo["rent"] && !isNaN(houseInfo["rent"])) {
      houseData.rent = houseInfo["rent"];
    } else {
      errorArray.push("Invalid House rent or missing value.");
    }

    //startDate
    if (houseInfo["startDate"] && isValidDate(houseInfo["startDate"])) {
      houseData.startDate = houseInfo["startDate"];
    } else {
      errorArray.push("Invalid House startDate or missing value.");
    }

    //endDate
    if (houseInfo["endDate"] && isValidDate(houseInfo["endDate"])) {
      houseData.endDate = houseInfo["endDate"];
    } else {
      errorArray.push("Invalid House endDate or missing value.");
    }

    //otherAmenities
    if (
      houseInfo["otherAmenities"] &&
      typeof houseInfo["otherAmenities"] == "string"
    ) {
      houseData.otherAmenities = houseInfo["otherAmenities"];
    } else {
      errorArray.push("Invalid House otherAmenities or missing value.");
    }

    //description
    if (
      houseInfo["description"] &&
      typeof houseInfo["description"] == "string"
    ) {
      houseData.description = houseInfo["description"];
    } else {
      errorArray.push("Invalid House description or missing value.");
    }

    //petFriendly
    if (typeof houseInfo["petFriendly"] === "boolean") {
      houseData.petFriendly = houseInfo["petFriendly"];
    } else {
      errorArray.push("Invalid House petFriendly info or missing value.");
    }

    //parkingAvailable
    if (typeof houseInfo["parkingAvailable"] === "boolean") {
      houseData.parkingAvailable = houseInfo["parkingAvailable"];
    } else {
      errorArray.push("Invalid House parkingAvailable info or missing value.");
    }
  } else {
    errorArray.push("Please provide all house information.");
  }

  if (errorArray.length > 0) {
    //console.log(errorArray); 
    throw `Errors : ${errorArray.toString()}`;
  }

  return houseData;
}

/**
 * Create schema dictionary for house data.
 * @param {} houseData  : house object with information.
 * @param {*} isUpdate : Set true if update operation is performed , else false.
 * If set false, _id will be set using uuid().
 * Return house schema dictionary.
 */
function createHouseSchema(houseData, isUpdate) {
  let houseSchema = {
    profilePicture: houseData.profilePicture,
    longitude: houseData.longitude,
    latitude: houseData.latitude,
    street: houseData.street,
    houseNumber: houseData.houseNumber,
    city: houseData.city,
    state: houseData.state,
    pincode: houseData.pincode,
    rent: houseData.rent,
    startDate: houseData.startDate,
    endDate: houseData.endDate,
    otherAmenities: houseData.otherAmenities,
    description: houseData.description,
    petFriendly: houseData.petFriendly,
    parkingAvailable: houseData.parkingAvailable,
  };

  if (!isUpdate) {
    houseSchema._id = uuidv4();
  }

  return houseSchema;
}

/**
 * Check and validate ID .
 * @param {} id : ID to be validate
 */
function getValidId(id) {
  if (!id) {
    throw "Given recipe id is invalid";
  }

  if (typeof id != "object" && typeof id != "string") {
    throw "Provide recipe id of type object or string ";
  }

  return id;
}

/**
 * Check and validate date using moment library.
 * @param {} date :  date to be validate
 */
function isValidDate(date) {
  return moment(date, "MM/DD/YYYY").isValid();
}

/**
 * check and validate value of longitude and latitude
 * @param {} longitude : longitude to be validate
 * @param {*} latitude : latitude to be validate
 */
function isValidLatitudeandLongitude(longitude, latitude) {
  if (latitude < -90 || latitude > 90) {
    return false;
  }
  if (longitude < -180 || longitude > 180) {
    return false;
  }

  return true;
}

module.exports = {
  getAllHouse,
  getHouseById,
  addHouse,
  updateHouse,
  deleteHouse,
};

/**
 * "_id" : "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310" - String,
“profilePicture” : “/sweethome/sweetHomeExample.jpg” - string
“street” : “Newport Parkway”,
“houseNumber” : “1214” - string,
"city" : "Hoboken" - string,
"state" : "NJ" - string,
“pincode” : “07310” - string,
“longitude” : 40.732628 - number
“latitude” : -74.037628 - number,
"rent" : "250" - number,
“startDate”: “01/01/2020” - date,
“endDate”: “01/07/2020” - date,
"houseTypes" : [{ - subdocument
"_id" : "7b7997a2-c0d2-4f8c-b27a-6a1d4b5b6310" ,
“type”: “studio”,
“bedroom”: 2,
“hall”: 1,
“kitchen”: 1
}],
"petFriendly" : true - boolean,
“otherAmenities” : “In home laundry, AC/heater facility, fully furnished”, - string
“Description” : “It’s a big house, train station nearby, neighbours are - string
annoying though”
“parkingAvailable” : false, - boolean
"reviewIds" : [ - array
"7c7997a2-c0d2-4f8c-b27a-6a1d4b5b6310"
]
}
 */
