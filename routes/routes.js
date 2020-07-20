const express = require("express");
const transactionRouter = express.Router();

const RouterSevice = require("../services/transactionService");

transactionRouter.post("/", RouterSevice.create);
transactionRouter.get("/", RouterSevice.findPeriod);
transactionRouter.put("/:id", RouterSevice.update);
transactionRouter.delete("/:id", RouterSevice.remove);

module.exports = transactionRouter;
