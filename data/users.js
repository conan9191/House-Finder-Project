/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 14:20:09
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-05 21:39:04
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

    async getUserById(id) {
        if(!id) throw "You must provide an id";
        if (typeof id !== "string") throw "ID needs to be a string";
        const objId = ObjectId.createFromHexString(id);
        const userCollection = await recipes();
        const user = await userCollection.findOne({ _id: objId });
        if (!user) throw 'Recipe not found';
        return user;
    }

};

module.exports = exportedMethods;