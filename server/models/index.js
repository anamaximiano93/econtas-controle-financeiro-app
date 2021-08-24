const mongoose = require("mongoose");

const TransactionModel = require("./TransactionModel.js");
const UserModel = require("./UserModel.js");

const db = {};

db.url = process.env.DB_CONNECTION;
db.mongoose = mongoose;
db.transaction = TransactionModel(mongoose);
db.user = UserModel;

module.exports = { db };
