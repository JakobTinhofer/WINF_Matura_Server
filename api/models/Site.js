let mongoose = require("mongoose");
const User = require("./User");
let siteSchema = mongoose.Schema({
  author:{
      type: User,
      require: true
  },
  src_folder:{
      type: String,
      require: true
  },
  start_file:{
      type: String,
      require: true
  }
});
var Site = mongoose.model("Site", siteSchema);
module.exports = Site;