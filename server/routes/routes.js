const express = require("express");
const RouterApi = express.Router();

//const TransactionService = require("../services/transactionService");
const UserService = require("../services/userService");

const authMiddleware = require("../middlewares/auth");

const pathUserID = "/user/transaction/:id";

/* RouterApi.post("/transaction", TransactionService.create);
RouterApi.get("/transaction", TransactionService.findPeriod);
RouterApi.put("/transaction/:id", TransactionService.update);
RouterApi.delete("/transaction/:id", TransactionService.remove);
RouterApi.get(
  "/transaction/chart/categories",
  TransactionService.findPeriodChart
);
RouterApi.get(
  "/transaction/chart/perYear",
  TransactionService.findPeriodForYear
);
RouterApi.get(
  "/transaction/chart/perYearMonth",
  TransactionService.findPeriodForYearMonth
); */

/* USER SERVICE */

RouterApi.post("/user/register", UserService.register);
RouterApi.post("/user/login", UserService.login);
RouterApi.get("/user/projects", authMiddleware, UserService.projects);
RouterApi.post("/user/forgot_password", UserService.forgot_password);
RouterApi.post("/user/reset_password", UserService.reset_password);
RouterApi.post(pathUserID, authMiddleware, UserService.createTransaction);
RouterApi.get(pathUserID, authMiddleware, UserService.findUserPeriod);
RouterApi.get(
  `${pathUserID}/chart/categories`,
  authMiddleware,
  UserService.findUserPeriodChart
);
RouterApi.get(
  `${pathUserID}/chart/perYear`,
  authMiddleware,
  UserService.findPeriodForYear
);
RouterApi.get(
  `${pathUserID}/chart/perYearMonth`,
  authMiddleware,
  UserService.findUserPeriodForYearMonth
);
RouterApi.put(
  "/user/:idUser/transaction/:idTransaction",
  authMiddleware,
  UserService.updateTransaction
);
RouterApi.delete(
  "/user/:idUser/transaction/:idTransaction",
  authMiddleware,
  UserService.removeTransaction
);
RouterApi.get("/user/:idUser", authMiddleware, UserService.getUser);
RouterApi.put("/user/:idUser", authMiddleware, UserService.updateUser);

module.exports = RouterApi;
