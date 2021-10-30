let mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const User = require("./User").schema;
let verificationSchema = mongoose.Schema({
  user:{
      type: User,
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
    let q = await Verification.find({'user.username': user.username});
    
    if(q && q.length > 0){
        return q[0];
    }

    let salt,secret;
    do {
        salt = await bcrypt.genSalt();
        secret = await bcrypt.hash(process.memoryUsage().heapTotal + process.hrtime()[1] + process.hrtime()[0] + user.username, salt);
        q = await Verification.find({secret: secret});
    }while(q && q.length > 0)



    let ver = new Verification();
    ver.secret = secret;
    ver.user = user;
    ver.save();
    return ver;
});
var Verification = mongoose.model("Verification", verificationSchema);
module.exports = Verification;