module.exports = (mongoose) => {
  let schema = mongoose.Schema({
    description: { type: String, requered: true },
    value: { type: Number, requered: true },
    category: { type: String, requered: true },
    year: { type: Number, requered: true },
    month: { type: Number, requered: true },
    day: { type: Number, requered: true },
    yearMonth: { type: String, requered: true },
    yearMonthDay: { type: String, requered: true },
    type: { type: String, requered: true },
  });

  const TransactionModel = mongoose.model("transaction", schema);

  return TransactionModel;
};
