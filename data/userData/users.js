/*
 * @Descripttion:
 * @version: 1.1
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 14:20:09
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 20:08:23
 */

const dbCollections = require("../../settings/collections");
const users = dbCollections.users;
const { ObjectId } = require("mongodb");

let exportedMethods = {
  /**
   * This method is used to get the list of all the users
   * @return: the users list
   */
  async getAllUsers() {
    const userCollection = await users();
    const userList = await userCollection.find().toArray();
    if (!userList || userList.length === 0) throw "No users in database!";
    return userList;
  },

  /**
   * This method is used to get the user object by id
   * @param {string} id
   * @return {object} user
   */
  async getUserById(id) {
    if (!id) throw "You must provide an id";
    if (typeof id !== "string") throw "ID needs to be a string";
    const objId = ObjectId.createFromHexString(id);
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: objId });
    if (!user) throw "Recipe not found";
    return user;
  },

  async addUser(firstName, lastName, email, hashedPassword) {
    checkIsProperString(firstName, "firstName");
    checkIsProperString(lastName, "lastName");
    checkIsProperString(email, "email");
    // checkIsProperString(profilePicture, "profilePicture");
    // checkIsProperString(street, "street");
    // checkIsProperString(house_number, "house number");
    // checkIsProperString(city, "city");
    // checkIsProperString(state, "state");
    // checkIsProperString(pincode, "pincode");
    // checkIsProperString(age, "age");
    checkIsProperString(hashedPassword, "hashedPassword");
    const userCollection = await users();
    let newUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      hashedPassword: hashedPassword,
      // profilePicture: profilePicture,
      // street: street,
      // house_number: house_number,
      // city: city,
      // state: state,
      // pincode: pincode,
      // age: age,

      // reviewIds: [],
      // favourites: []
    };
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Insert failed!";
    const newId = newInsertInformation.insertedId;
    return await this.getUserById(newId.toString());
  },

  async getUserByEmail(email) {
    if (!email) throw "You must provide an email to search for";

    const userCollection = await users();
    const userResult = await userCollection.findOne({ email: email });
    if (userResult === null) throw "No User with that email";
    return userResult;
  },

  async removeUser(id) {
    if (!id) throw "You must provide an id";
    if (typeof id !== "string") throw "ID needs to be a string";
    const objId = ObjectId.createFromHexString(id);
    const userCollection = await users();
    const deletionInfo = await userCollection.removeOne({ _id: objId });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete user with id of ${id}`;
    }
  },
};

/**
 * This method is used to check if the data is a proper string
 * @param {string} val
 * @param {string} variableName
 */
function checkIsProperString(val, variableName) {
  if (!val)
    throw `You must provide a ${
      variableName || "provided variable"
    } for the user`;
  if (typeof val !== "string")
    throw `${variableName || "provided variable"} is not a string`;
  if (val.length === 0) throw `${variableName || "provided variable"} is null`;
}

module.exports = exportedMethods;
