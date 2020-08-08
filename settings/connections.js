/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2020-08-07 18:56:00
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 18:58:39
 */
const MongoClient = require("mongodb").MongoClient;

const mongoConfig = {
  serverUrl: "mongodb://localhost:27017/",
  database: "House",
};

let _connection = undefined;
let _db = undefined;

module.exports = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};