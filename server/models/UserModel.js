//const TransactionModel = require("./TransactionModel.js");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, requered: true },
    email: { type: String, requered: true, unique: true, lowercase: true },
    avatar: { type: String, requered: false },
    password: { type: String, requered: true, select: false },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    transactions: [
      {
        description: { type: String, requered: true },
        value: { type: Number, requered: true },
        category: { type: String, requered: true },
        year: { type: Number, requered: true },
        month: { type: Number, requered: true },
        day: { type: Number, requered: true },
        yearMonth: { type: String, requered: true },
        yearMonthDay: { type: String, requered: true },
        type: { type: String, requered: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
