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

exports.validatePassword = (password) => {
    if(password.length < 6 || password.length > 256){
        return [false, 0, "Password must be between 6 and 256 characters long."];
    }
    return [true];
}
const invalidChars = /[*|\",\/:<>?[\]{}`\\()';@&$]/
const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
exports.validateUsername = (username) => {
    if(username.length < 4 || username.length > 40){
        return [false, 0, "The username needs to be between 4 and 40 characters in length"];   
    }     
    
    if(emailRegex.test(String(username).toLocaleLowerCase())){
        return [false, 1, "Please, do not provide an email as a username. There is an email field for that. ;)"];
    }

    if(invalidChars.test(username)){
        return [false, 2, "The username can not contain these characters: * | " + '"' + " , / : < > ? [ ] { } ` \\ () ' ; @ & $"];
    }



    return [true];
}

exports.validateEmail =  (email) => {
    if(!emailRegex.test(String(email).toLocaleLowerCase())){
        return [false, 0, "Please provide a valid email address."];
    }
    return [true];
}