const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const { Schema } = mongoose;

var userSchema = new Schema({
  name: String,
  email: { type: String, lowercase: true },
  password: { type: String, default: "" },
  isAdmin: { type: Boolean },
  facebookId: String,
  googleId: String
});

userSchema.methods.encryptPassword = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

mongoose.model("users", userSchema);
