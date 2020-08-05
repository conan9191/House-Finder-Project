/*
 * @Descripttion: 
 * @version: 1.0
 * @Author: Yiqun Peng
 * @Date: 2020-08-05 14:20:09
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-05 15:48:02
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
    }
};

module.exports = exportedMethods;