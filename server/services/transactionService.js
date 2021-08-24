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
    const data = await TransactionModel.find({
      yearMonth: period,
    }).sort({
      day: 1,
    });

    const revenue = data.reduce((acc, curr) => {
      if (curr.type === "+") return acc + curr.value;
      else return acc;
    }, 0);

    const expense = data.reduce((acc, curr) => {
      if (curr.type === "-") return acc + curr.value;
      else return acc;
    }, 0);

    const balance = revenue - expense;

    const result = {
      revenue,
      expense,
      balance,
      length: data.length > 0 ? data.length : -1,
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
const findPeriodChart = async (req, res) => {
  const period = req.query.period;
  let categories = [];
  //const options = sort: { day: 1 } ; //

  try {
    const data = await TransactionModel.find({
      yearMonth: period,
    }).sort({
      day: 1,
    });

    data.forEach(({ type, category }) => {
      if (
        categories.indexOf(category) === -1 &&
        type === "-" &&
        category !== "Receita"
      )
        categories.push(category);
    });

    categories = categories
      .sort((a, b) => a.localeCompare(b))
      .map((dataCategory) => {
        const totalCategory = data.reduce((acc, cur) => {
          if (cur.category === dataCategory && cur.type === "-")
            return acc + cur.value;
          return acc;
        }, 0);
        return [dataCategory, totalCategory];
      });

    const result = {
      length: categories.length > 0 ? categories.length : -1,
      transaction: categories,
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
const findPeriodForYear = async (req, res) => {
  const typeFilter = req.query.type;
  let categories = [];
  //const options = sort: { day: 1 } ; //

  const type_ = typeFilter === "expense" ? "-" : "+";

  try {
    const data = await TransactionModel.aggregate([
      { $match: { type: type_ } },
      { $group: { _id: "$year", total: { $sum: "$value" } } },
      { $sort: { year: 1 } },
    ]);

    const valuesKeys = data.map((item) => Object.values(item));

    const result = {
      length: valuesKeys.length > 0 ? data.length : -1,
      transaction: valuesKeys,
    };

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error when trying to search by period: " + error });
  }
};
const findPeriodForYearMonth = async (req, res) => {
  const year = parseInt(req.query.year);
  //const options = sort: { day: 1 } ; //
  try {
    const data = await TransactionModel.aggregate([
      { $match: { year: year } },
      {
        $group: {
          _id: "$yearMonth",
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$type", "+"] }, "$value", 0],
            },
          },
          expense: {
            $sum: {
              $cond: [{ $eq: ["$type", "-"] }, "$value", 0],
            },
          },
        },
      },
      { $sort: { month: 1, _id: 1 } },
    ]);

    const valuesKeys = data.map((item) => Object.values(item));

    const result = {
      length: valuesKeys.length > 0 ? valuesKeys.length : -1,
      transaction: valuesKeys,
    };

    res.send(result);
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

module.exports = {
  create,
  findPeriod,
  update,
  remove,
  findPeriodChart,
  findPeriodForYear,
  findPeriodForYearMonth,
};
