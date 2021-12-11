const fs = require('fs');

var html_color_dict;
fs.readFile('./html_color_dict.json', (err, data) => {
    if(err){
        console.log("Error while reading colors from color dict: " + err);
        process.exit(-1234);
    }
    try {
        html_color_dict = JSON.parse(data);    
    } catch (error) {
        console.log("Error while parsing json in color dict: " + err);
        process.exit(-1234);
    }
    console.log("Read color dict from json file!");
});

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
const illegalPaths = ["login", "signup", "security", "admin", "createsite", "deletesite", "addsite", "recover"];

const pathUnsaveChars = /[^a-zöäü0-9-_]/i;
exports.validateCustomPath = (path) => {
    if(!path || path.length < 4 || path.length > 128){
        return [false, 0, "The custom path must be between 4 and 128 characters in length!"];
    }
    if(pathUnsaveChars.test(path)){
        return [false, 1, "Please do not use any special chars in your path!"];
    }
    if(illegalPaths.includes(path.toLocaleLowerCase())){
        return [false, 2, "This path is reserved."];
    }
    return [true];
}

const tagIllegalChars = /[^a-zöäüß0-9]/i;
exports.validateTagName = (tag) => {
    if(!tag || tag.length < 3 || tag.length > 32){
        return [false, 0, "The tag name must be between 3 and 32 characters in length!"];
    }
    if(tagIllegalChars.test(tag)){
        return [false, 1, "The tag must not contain such special characters!"];
    }
    return [true];
}

exports.validateSecLevel = (sec_level, maxSecLevel = 10) => {
    if(maxSecLevel > 10)
        throw "Sec levels can never be above 10!";
    if(sec_level < 0 || sec_level > 10 || sec_level > maxSecLevel){
        return [false, 0, "The sec level must be between 0 and " + maxSecLevel + "!"];
    }
    return [true];
}

exports.validateSiteTitle = (title) => {
    if(!title || title.length < 2 || title.length > 40){
        return [false, 0, "Your title must be between 2 and 40 characters in length!"];
    }
    return [true];
}


const isHex = /^[#]?[a-f0-9]{6}([a-f0-9]{2})?$/i
//https://regex101.com/r/vFtjrk/1
const isrgb = /^rgb\((\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,[ \t]?){2}(\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b)\)$/i
const isrgba = /^rgba\((\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b,[ \t]?){2}(\b(1?[0-9]{1,2}|2[0-4][0-9]|25[0-5])\b),[ \t]?0\.[0-9]{0,5}\)$/i
exports.validateColor = (c) => {
    const color = c.toLocaleLowerCase();
    if(!isHex.test(color) && html_color_dict[color] === undefined && !isrgb.test(color) && !isrgba.test(color)){
        return [false, 0, "Sorry, we don't know this color! You can try to enter it in hexadecimal (like #00ffff)"]
    }
    return [true];
}