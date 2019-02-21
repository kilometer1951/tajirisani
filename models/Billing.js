const mongoose = require("mongoose");
const { Schema } = mongoose;

const billingSchema = new Schema({
  name_bill: String,
  mobile_number: String,
  address_checkout: String,
  state_city: String,
  address_type: String,
  user: { type: Schema.Types.ObjectId, ref: "users" }
});

mongoose.model("billing", billingSchema);
