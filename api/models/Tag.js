let mongoose = require("mongoose");
let tagSchema = mongoose.Schema({
  name:{
      type: String,
      require: true
  },
  color:{
      type: String,
      require: true
  },
  min_sec_level:{
      type: Number,
      require: true
  },
  can_sort:{
      type: Boolean,
      require: true
  }
});
var Tag = mongoose.model("Tag", tagSchema);
module.exports = Tag;