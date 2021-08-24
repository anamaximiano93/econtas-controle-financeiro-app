const mongoose = require("mongoose");
//const ObjectId = mongoose.Types.ObjectId;

const { db } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const UserModel = db.user;
const handlebars = require("handlebars");
const fs = require("fs");

const mailer = require("../helper/mailer");

const { resolve } = require("path");

const generateToken = (params = {}) => {
  return jwt.sign(params, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 86400,
  });
};

// register user
const register = async (req, res) => {
  const { name, email, password, transactions } = req.body;

  const newUser = new UserModel({
    name,
    email,
    password,
    transactions,
  });

  try {
    if (await UserModel.findOne({ email })) {
      return res.status(400).send({
        message: "User already existis",
      });
    }

    const user = await newUser.save();
    user.password = undefined;

    const token = generateToken({ id: user.id });

    if (!user) {
      res.status(404).send({ message: "Couldn't Launch New User" });
    } else {
      res.send({ user, token });
    }
  } catch (error) {
    res.status(500).send({ message: "Error while inserting User::: " + error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).select(
      "+password -transactions -updatedAt"
    );

    if (!user) return res.status(400).send({ message: "User not found" });

    if (!(await bcrypt.compare(password, user.password)))
      return res.status(400).send({ message: "Invalid password" });

    user.password = undefined;

    const token = generateToken({ id: user.id });

    res.send({ user, token });
  } catch (error) {
    res.status(500).send({ message: "Error while inserting User::: " + error });
  }
};

const updateUser = async (req, res) => {
  const Userid = req.params.idUser;
  const body = req.body;

  try {
    const verify = await UserModel.findOne({ email: body.email });

    if (verify) {
      if (verify.id !== Userid) {
        return res.status(400).send({
          message: "User email already existis",
        });
      }
    }

    const user = await UserModel.findOne({
      _id: Userid,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const data = await UserModel.findByIdAndUpdate({ _id: Userid }, body);

    if (!data) {
      res
        .status(500)
        .send({ message: "Update not performed... please contact Adm" });
    } else {
      res.send({ message: "Successfully updated user" });
    }
  } catch (error) {
    res.status(500).send({ message: error });
  }
};

const getUser = async (req, res) => {
  const { idUser } = req.params;

  try {
    const user = await UserModel.findOne({ _id: idUser }).select("+updatedAt");

    if (!user) return res.status(400).send({ message: "User not found" });

    res.send({ user });
  } catch (error) {
    res.status(500).send({ message: "Error while inserting User::: " + error });
  }
};

const projects = async (req, res) => {
  res.send({ ok: true });
};

const forgot_password = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).send({ message: "User not found" });

    const passwordResetToken = crypto.randomBytes(20).toString("hex");

    const passwordResetExpires = new Date();
    passwordResetExpires.setHours(passwordResetExpires.getHours() + 1);

    await UserModel.findByIdAndUpdate(user.id, {
      $set: { passwordResetToken, passwordResetExpires },
    });

    const pathTemplate = resolve(
      __dirname,
      "..",
      "helper",
      "resources",
      "mail",
      "forgot_password.hbs"
    );

    const templateFileContent = fs.readFileSync(pathTemplate).toString("utf8");

    const mailTemplateParse = handlebars.compile(templateFileContent);

    const html = mailTemplateParse({
      token: passwordResetToken,
    });
    const mail = {
      to: email,
      from: "teste.oteste2017@gmail.com",
      html,
      /*  template: "/mail/main",
      context: { token: passwordResetToken }, */
    };

    mailer.sendMail(mail, (err) => {
      if (err) return res.status(400).send({ error: "não enviou", err });

      res.status(200).send({ message: "Email enviado com sucesso" });
    });
  } catch (error) {
    console.log(error);
  }
};

const reset_password = async (req, res) => {
  const { email, password } = req.body;
  const token = req.query.token;

  try {
    const user = await UserModel.findOne({ email }).select(
      "+passwordResetToken passwordResetExpires"
    );
    if (!user) return res.status(400).send({ message: "User not found" });

    if (token !== user.passwordResetToken)
      return res.status(400).send({ message: "Token invalid" });

    const now = new Date();

    if (now > user.passwordResetExpires)
      return res
        .status(400)
        .send({ message: "Token expired, generate a new one" });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res.status(200).send({ message: "Senha resetada com sucesso!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ message: "Erro ao resetar a senha" });
  }
};

const createTransaction = async (req, res) => {
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

  const { id } = req.params;

  const user = await UserModel.findOne({
    _id: id,
  });

  if (!user) return res.status(400).send({ message: "User not found" });

  const transaction = {
    description,
    value,
    category,
    year,
    month,
    day,
    yearMonth,
    yearMonthDay,
    type,
  };

  try {
    const data = await UserModel.updateOne(
      { _id: user._id },
      { $push: { transactions: transaction } }
    );

    if (!data) {
      res.status(404).send({ message: "Couldn't Launch New Transaction" });
    } else {
      res.send({ message: "Transaction successfully inserted" });
    }
    res.send();
  } catch (error) {
    res.status(500).send({ message: "Error while inserting: " + error });
  }
};
//FindPeriod
const findUserPeriod = async (req, res) => {
  const period = req.query.period;
  const { id } = req.params;
  //const options = sort: { day: 1 } ; //

  if (!period)
    return res.status(500).send({
      error:
        'It is necessary to inform the parameter "period", whose value must be in the format yyyy-mm',
    });

  try {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const data = user.transactions.filter((item) => item.yearMonth === period);

    if (!data)
      return res.status(400).send({ error: "User no transaction this period" });

    const revenue = data.reduce((acc, curr) => {
      if (curr.type === "+") return parseFloat(acc) + parseFloat(curr.value);
      else return acc;
    }, 0);

    const expense = data.reduce((acc, curr) => {
      console.debug("expence", acc, curr.value);
      if (curr.type === "-") return parseFloat(acc) + parseFloat(curr.value);
      else return acc;
    }, 0);

    const balance = parseFloat(revenue - expense);

    const result = {
      revenue,
      expense,
      balance,
      length: data.length > 0 ? data.length : -1,
      transaction: data,
    };

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error when trying to search by period: " + error });
  }
};

const findUserPeriodChart = async (req, res) => {
  const period = req.query.period;
  const { id } = req.params;
  let categories = [];
  //const options = sort: { day: 1 } ; //

  try {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const data = user.transactions.filter((item) => item.yearMonth === period);

    data.forEach(({ type, category }) => {
      if (categories.indexOf(category) === -1 && type === "-")
        categories.push(category);
    });

    const label = [];
    const valuesData = [];

    categories
      .sort((a, b) => a.localeCompare(b))
      .map((dataCategory) => {
        const totalCategory = data.reduce((acc, cur) => {
          if (cur.category === dataCategory && cur.type === "-")
            return acc + cur.value;
          return acc;
        }, 0);
        /* return [dataCategory, totalCategory]; */
        label.push(dataCategory);
        valuesData.push(totalCategory);
      });

    categories = {
      labels: label,
      values: valuesData,
    };

    const result = {
      length: label.length > 0 ? label.length : -1,
      transaction: categories,
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
  const { id } = req.params;
  let chartYears = [];
  //const options = sort: { day: 1 } ; //

  const type_ = typeFilter === "expense" ? "-" : "+";

  try {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const data = user.transactions;
    data.forEach(({ type, year }) => {
      if (chartYears.indexOf(year) === -1 && type === type_)
        chartYears.push(year);
    });

    const label = [];
    const valuesData = [];

    chartYears
      .sort((a, b) => a - b)
      .map((dataYear) => {
        const values = data.reduce((acc, cur) => {
          if (cur.year === dataYear && cur.type === type_) {
            return acc + cur.value;
          }
          return acc;
        }, 0);

        label.push(dataYear);
        valuesData.push(values);
        /*  return [dataYear, values]; */
      });

    chartYears = {
      labels: label,
      values: valuesData,
    };

    const result = {
      length: label.length > 0 ? label.length : -1,
      transaction: chartYears,
    };

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error when trying to search by period: " + error });
  }
};
const findUserPeriodForYearMonth = async (req, res) => {
  const year = parseInt(req.query.year);
  const { id } = req.params;

  let chartYeatMonth = [];

  try {
    const user = await UserModel.findOne({
      _id: id,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const data = user.transactions.filter((item) => item.year === year);

    data.forEach(({ yearMonth }) => {
      if (chartYeatMonth.indexOf(yearMonth) === -1)
        chartYeatMonth.push(yearMonth);
    });
    const categoriaData = [];
    const receitaData = [];
    const despesaData = [];
    const saldoData = [];

    chartYeatMonth
      .sort((a, b) => a - b)
      .map((dataYearMonth) => {
        const despesas = data.reduce((acc, cur) => {
          if (cur.yearMonth === dataYearMonth && cur.type === "-")
            return acc + cur.value;
          return acc;
        }, 0);
        const receitas = data.reduce((acc, cur) => {
          if (cur.yearMonth === dataYearMonth && cur.type === "+")
            return acc + cur.value;
          return acc;
        }, 0);

        categoriaData.push(dataYearMonth);
        receitaData.push(receitas);
        despesaData.push(despesas);
        saldoData.push(receitas - despesas);
      });

    chartYeatMonth = {
      categoria: categoriaData,
      receita: receitaData,
      despesa: despesaData,
      saldo: saldoData,
    };

    const result = {
      length: categoriaData.length > 0 ? categoriaData.length : -1,
      transaction: chartYeatMonth,
    };

    res.send(result);
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error when trying to search by period: " + error });
  }
};
//Update
const updateTransaction = async (req, res) => {
  const idTransaction = req.params.idTransaction;
  const Userid = req.params.idUser;
  const body = req.body;

  try {
    const user = await UserModel.findOne({
      _id: Userid,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const index = user.transactions.findIndex(
      (item) => item.id === idTransaction
    );

    if (index === -1)
      return res.status(400).send({ error: "User Transaction Invalid" });

    /* const data = await UserModel.findOneAndUpdate(
      { _id: Userid },
      { $set: { transactions: { $each: [body], $position: index } } }
    ); */

    const data = await UserModel.findOneAndUpdate(
      { _id: Userid, "transactions._id": idTransaction },
      {
        $set: {
          "transactions.$.description": body.description,
          "transactions.$.value": body.value,
          "transactions.$.year": body.year,
          "transactions.$.yearMonth": body.yearMonth,
          "transactions.$.yearMonthDay": body.yearMonthDay,
          "transactions.$.type": body.type,
          "transactions.$.month": body.month,
          "transactions.$.day": body.day,
          "transactions.$.category": body.category,
        },
      }
    );
    /*  const data = await UserModel.findByIdAndUpdate(
      { _id: Userid },
      { $set: { $position: index, transactions: { $each: [body] } } }
    ); */

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
const removeTransaction = async (req, res) => {
  const idTransaction = req.params.idTransaction;
  const Userid = req.params.idUser;

  try {
    const user = await UserModel.findOne({
      _id: Userid,
    });

    if (!user) return res.status(400).send({ message: "User not found" });

    const index = user.transactions.findIndex(
      (item) => item.id === idTransaction
    );

    if (index === -1)
      return res.status(400).send({ error: "User Transaction Invalid" });

    const data = await UserModel.findByIdAndUpdate(
      { _id: Userid },
      { $pull: { transactions: { _id: idTransaction } } }
    );

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
  register,
  login,
  findUserPeriod,
  updateTransaction,
  removeTransaction,
  findUserPeriodChart,
  findPeriodForYear,
  findUserPeriodForYearMonth,
  projects,
  forgot_password,
  reset_password,
  createTransaction,
  getUser,
  updateUser,
};
