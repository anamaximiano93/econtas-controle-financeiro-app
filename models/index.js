const mongoose = require("mongoose");

const TransactionModel = require("./TransactionModel.js");

const db = {};

db.url = process.env.DB_CONNECTION;
db.mongoose = mongoose;
db.transaction = TransactionModel(mongoose);

module.exports = { db };
