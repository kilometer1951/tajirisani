const mongoose = require("mongoose");
const { Schema } = mongoose;
const itemSchema = require("./item");

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  items: [itemSchema],
  hasCheckedout: { type: Boolean, default: false },
  name: String,
  mobile_number: String,
  address: String,
  state_city: String,
  address_type: String,
  totalPrice: String,
  orderShipped: { type: Boolean, default: false }
});

mongoose.model("carts", cartSchema);
