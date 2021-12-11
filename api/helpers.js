var crypto = require('crypto');
var bcrypt = require('bcrypt');

exports.getRandom3ByteHex = async () => {
    let buffer = await crypto.randomBytes(3);
    return buffer.toString('hex');
}

exports.userToUserInfo = (user) => {
    return {
        username: user.username,
        email: user.email,
        sec_level: user.sec_level,
        created: user.created,
        verified: user.verified
    }
}

exports.generateNewSecret = async () => {
    let salt = await bcrypt.genSalt();
    return await bcrypt.hash(process.memoryUsage().heapTotal + process.hrtime()[1] + process.hrtime()[0] + exports.getRandom3ByteHex(), salt);
}

exports.hashPassword = async (pw) => {
    let salt = await bcrypt.genSalt(); 
    return await bcrypt.hash(pw, salt);
}
