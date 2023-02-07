const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
let _db; // 1
// 2
const mongodbUrl =
  "mongodb+srv://Srw:123@saharcluster.ldhpsfa.mongodb.net/shop?retryWrites=true&w=majority";
// 3
const initDb = (callback) => {
  if (_db) {
    console.log("db already initialized");
    return callback(null, _db); // the null is for no error
  }
  MongoClient.connect(mongodbUrl)
    .then((client) => {
      console.log("succedd connection to shop");
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      console.log("before callback err");
      callback(err);
    });
};

// 4
const getdb = () => {
  if (!_db) {
    throw error("Database is not initaialize");
  }
  return _db;
};
// 5
module.exports = {
  initDb,
  getdb,
};
