/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 14:20:09
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-06 00:55:18
 */
const mongoCollections = require('../config/mongoCollections');
const bands = mongoCollections.users;
const { ObjectId } = require('mongodb');

let exportedMethods = {
    /**
     * This method is used to get the list of all the users
     * @return: the users list
     */
    async getAllUsers() {
        const userCollection = await users();
        const userList = await userCollection.find().toArray();
        if (!userList|| userList.length === 0) throw 'No users in database!';
        return userList;
    },

    /**
     * This method is used to get the user object by id
     * @param {string} id
     * @return {object} user 
     */
    async getUserById(id) {
        if(!id) throw "You must provide an id";
        if (typeof id !== "string") throw "ID needs to be a string";
        const objId = ObjectId.createFromHexString(id);
        const userCollection = await recipes();
        const user = await userCollection.findOne({ _id: objId });
        if (!user) throw 'Recipe not found';
        return user;
    },

    /**
     * This method is used to add a user
     * @param {*} 
     * @return {object} user 
     */
    async addUser(firstName, lastName, email, profilePicture, street, 
        house_number, city, state, pincode, age, hashedPassword) {
        checkIsProperString(firstName, "firstName");
        checkIsProperString(lastName, "lastName");
        checkIsProperString(email, "email");
        checkIsProperString(profilePicture, "profilePicture");
        checkIsProperString(street, "street");
        checkIsProperString(house_number, "house number");
        checkIsProperString(city, "city");
        checkIsProperString(state, "state");
        checkIsProperString(pincode, "pincode");
        checkIsProperString(age, "age");
        checkIsProperString(hashedPassword, "hashedPassword");
        const recipeCollection = await recipes();
        let newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            profilePicture: profilePicture,
            street: street,
            house_number: house_number,
            city: city,
            state: state,
            pincode: pincode,
            age: age,
            hashedPassword: hashedPassword,
            reviewIds: [],
            favourites: []
        };
        const newInsertInformation = await userCollection.insertOne(newUser);
        if (newInsertInformation.insertedCount === 0) throw 'Insert failed!';
        const newId = newInsertInformation.insertedId;
        return await this.getUserById(newId.toString());
    },

    /**
     * This is the method to update the user info and return user object
     * @param {*} 
     * @return {object} user
     */
    async updateUser(id, updatedUser) {
        checkIsProperString(id,"id");
        const userCollection = await users();
        const updatedUserData = {};
        if (updatedUser.firstName) {
            checkIsProperString(updatedUser.firstName, "firstName")
            updatedUserData.firstName = updatedUser.firstName;
        }
        if (updatedUser.lastName) {
            checkIsProperString(updatedUser.lastName, "lastName")
            updatedUserData.lastName = updatedUser.lastName;
        }
        if (updatedUser.profilePicture) {
            checkIsProperString(updatedUser.profilePicture, "profilePicture")
            updatedUserData.profilePicture = updatedUser.profilePicture;
        }
        if (updatedUser.street) {
            checkIsProperString(updatedUser.street, "street")
            updatedUserData.street = updatedUser.street;
        }
        if (updatedUser.house_number) {
            checkIsProperString(updatedUser.house_number, "house_number")
            updatedUserData.house_number = updatedUser.house_number;
        }
        if (updatedUser.city) {
            checkIsProperString(updatedUser.city, "city")
            updatedUserData.city = updatedUser.city;
        }
        if (updatedUser.state) {
            checkIsProperString(updatedUser.state, "state")
            updatedUserData.state = updatedUser.state;
        }
        if (updatedUser.pincode) {
            checkIsProperString(updatedUser.pincode, "pincode")
            updatedUserData.pincode = updatedUser.pincode;
        }
        if (updatedUser.age) {
            checkIsProperString(updatedUser.age, "age")
            updatedUserData.age = updatedUser.age;
        }
        if (updatedUser.hashedPassword) {
            checkIsProperString(updatedUser.hashedPassword, "hashedPassword")
            updatedUserData.hashedPassword = updatedUser.hashedPassword;
        }
        if (updatedUser.firstName) {
            checkIsProperString(updatedUser.firstName, "firstName")
            updatedUserData.firstName = updatedUser.firstName;
        }
        if (updatedUser.reviewIds) {
            if (!Array.isArray(updatedUser.reviewIds)) throw "ReviewIds need to be array";
            if (updatedUser.reviewIds.length <= 0)throw "Length of reviewIds need to be greater than zero";
            for(let r of updatedUser.reviewIds){
                if (typeof r !== "string") throw "Each reviewId needs to be a string";
                if (r.length <= 0)throw "Length of reviewId need to be greater than zero";
            }
            updatedUserData.reviewIds = updatedUser.reviewIds;
        }
        if (updatedUser.favourites) {
            if (!Array.isArray(updatedUser.favourites)) throw "Favourites need to be array";
            if (updatedUser.favourites.length <= 0)throw "Length of favourites need to be greater than zero";
            for(let i of updatedUser.favourites){
                if (typeof i !== "object" || Array.isArray(i)) throw "Each favourites needs to be a object";
                if (Object.keys(i).length !== 2)throw "Length of favourites need to be 2 (favouriteId and houseId)";
                if (i.hasOwnProperty("favouriteId") === false || i.hasOwnProperty("houseId") === false)throw "The favourite need to have favouriteId and houseId)";
                if (typeof i["favouriteId"] !== "string") throw "favouriteId of favourite needs to be a string";
                if (typeof i["houseId"] !== "string") throw "houseId of favourite needs to be a string";
                if (i["favouriteId"].length <= 0)throw "Length of favouriteId of favourite need to be greater than zero";
                if (i["houseId"].length <= 0)throw "Length of houseId of favourite need to be greater than zero";
            }
            updatedUserData.favourites = updatedUser.favourites;
        }
        const objId = ObjectId.createFromHexString(id);
        const updateInfo = await userCollection.updateOne({ _id: objId }, { $set: updatedUserData});
        if (!updateInfo.matchedCount && !updateInfo.modifiedCount)throw 'Update failed';

        return await this.getUserById(id);
    },


    async removeUser(id) {
        if(!id) throw new "You must provide an id";
        if (typeof id !== "string") throw "ID needs to be a string";
        const objId = ObjectId.createFromHexString(id);
        const userCollection = await users();
        const deletionInfo = await userCollection.removeOne({ _id: objId });
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete user with id of ${id}`;
        }
        return;
    }
};

/**
 * This method is used to check if the data is a proper string
 * @param {string} val
 * @param {string} variableName
 */
function checkIsProperString(val, variableName) {
    if(!val) throw `You must provide a ${variableName || 'provided variable'} for the user`;
    if (typeof val !== 'string') throw `${variableName || 'provided variable'} is not a string`;
    if (val.length === 0) throw `${variableName || 'provided variable'} is null`;
}


module.exports = exportedMethods;