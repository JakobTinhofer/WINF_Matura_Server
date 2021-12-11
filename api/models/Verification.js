let mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const helpers = require("../helpers");
let verificationSchema = mongoose.Schema({
  user:{
      type: Object,
      require: true
  },
  secret:{
      type: String,
      require: true
  },
  alreadyVerified:{
      type: Boolean,
      require: true,
      default: false
  }
});

verificationSchema.static('getOrCreateNew', async (user) => {
    let q = await Verification.findOne({'user.username': user.username});
    
    if(q){
        return q;
    }

    let secret;
    do {
        secret = await helpers.generateNewSecret();
    }while(q && q.length > 0)



    let ver = new Verification();
    ver.secret = secret;
    ver.user = helpers.userToUserInfo(user);
    ver.save();
    console.log("Created verification ending in '" + secret.substring(secret.length - 11, secret.length - 1) + "' for user " + user.username);
    return ver;
});
var Verification = mongoose.model("Verification", verificationSchema);
module.exports = Verification;