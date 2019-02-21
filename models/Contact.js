const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema({
  contactusername: String,
  contactemail: String,
  contactpnum: String,
  contactcomment: String,
  hasViewed: { type: Boolean, default: false }
});

mongoose.model("contact", contactSchema);
