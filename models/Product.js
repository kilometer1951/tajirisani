const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;

var productSchema = new Schema({
  date: { type: Date, default: Date.now },
  product_name: String,
  price: String,
  prev_price: String,
  description: String,
  image1: String,
  image2: String,
  image3: String,
  category: String,
  discount: String
});

mongoose.model("products", productSchema);
