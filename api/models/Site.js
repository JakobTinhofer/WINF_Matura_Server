let mongoose = require("mongoose");
const User = require("./User").schema;
let siteSchema = mongoose.Schema({
  author:{
      type: Object,
      require: true
  },
  dir_path_end:{
      type: String,
      require: true
  },
  start_file:{
      type: String,
      require: true
  },
  title:{
      type: String,
      require: true
  },
  isPublic:{
      type: Boolean,
      require: true
  },
  hex_id:{
      type: String,
      require: true
  }
});
var Site = mongoose.model("Site", siteSchema);
module.exports = Site;