let mongoose = require("mongoose");
let userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password_hash: {
      type: String,
      required: true
  },
  sec_level: {
    type: Number,
    required: true,
    default: 0
  },
  created: {
    type: Date,
    default: Date.now()
  }
});
var User = mongoose.model("User", userSchema);
module.exports = User;