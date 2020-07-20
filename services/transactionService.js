const mongoose = require("mongoose");
//const ObjectId = mongoose.Types.ObjectId;

const { db } = require("../models/index");

const TransactionModel = db.transaction;

//Create
const create = async (req, res) => {
  const {
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth,
    yearMonthDay,
    type,
  } = req.body;

  const newTransaction = new TransactionModel({
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth,
    yearMonthDay,
    type,
  });

  try {
    const data = await newTransaction.save(newTransaction);

    if (!data) {
      res.status(404).send({ message: "Couldn't Launch New Transaction" });
    } else {
      res.send({ message: "Transaction successfully inserted" });
    }
  } catch (error) {
    res.status(500).send({ message: "Error while inserting: " + error });
  }
};
//FindPeriod
const findPeriod = async (req, res) => {
  const period = req.query.period;

  //const options = sort: { day: 1 } ; //

  try {
    const data = await TransactionModel.find({ yearMonth: period }).sort({
      day: 1,
    });

    const result = {
      length: data.length,
      transaction: data,
      //sumary: Sumary.getSumary(data),
    };

    if (!period) {
      res.status(500).send({
        error:
          'It is necessary to inform the parameter "period", whose value must be in the format yyyy-mm',
      });
    } else {
      res.send({ result });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error when trying to search by period: " + error });
  }
};
//Update
const update = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  try {
    const data = await TransactionModel.findByIdAndUpdate({ _id: id }, body);

    if (!data) {
      res
        .status(500)
        .send({ message: "Update not performed... please contact Adm" });
    } else {
      res.send({ message: "Successfully updated transaction" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};
//Remove
const remove = async (req, res) => {
  const id = req.params.id;

  try {
    const data = await TransactionModel.findByIdAndDelete({ _id: id });

    if (!data) {
      res
        .status(500)
        .send({ message: "Delete not performed... please contact Adm" });
    } else {
      res.send({ message: "Successfully Deleted transaction" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

module.exports = { create, findPeriod, update, remove };
