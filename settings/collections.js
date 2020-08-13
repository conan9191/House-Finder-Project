/*
 * @Descripttion:
 * @version:
 * @Author: sueRimn
 * @Date: 2020-08-07 18:53:59
 * @LastEditors: Yiqun Peng
 * @LastEditTime: 2020-08-07 19:33:09
 */
const dbConnection = require("./connections.js");

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  house: getCollectionFn("House"),
  favourite: getCollectionFn("Favourite"),
  users: getCollectionFn("users"),
  comments: getCollectionFn("Comments"),
};
