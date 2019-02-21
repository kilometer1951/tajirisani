const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  products: { type: Schema.Types.ObjectId, ref: "products" },
  qty: { type: Number, default: 0 },
  price: String
});

module.exports = itemSchema;
