const dbConnection = require("./connections");

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
};
