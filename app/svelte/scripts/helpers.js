

exports.convertToBool = (val) => {
    if(!val)
        return false;

    if (typeof val === 'string' || val instanceof String){
        return (val.toLocaleLowerCase() === 'true');
    }
    if(typeof val === 'number' || val instanceof Number){
        return (val !== 0);
    }
    if(typeof val === 'boolean' || val instanceof Boolean){
        return val;
    }
    console.debug(val);
    throw "Value cannot be converted. Sorry.";
};


exports.isValidUsername = (val) => {
    const invalidChars = /[*|\",\/:<>?[\]{}`\\()';@&$]/;
    return !invalidChars.test(val);
};


exports.invalidCharacterMessage = "The username can not contain these characters: * | " + '"' + " , / : < > ? [ ] { } ` \\ () ' ; @ & $";

exports.isEmail = (val) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(val).toLocaleLowerCase());
};


var colors = ["maroon","red","purple","fuchsia","green","lime","olive","yellow","navy","blue","teal","aqua"];
var highest_index = colors.length - 1;
var maxID = -1;

var colorIndexByID = {};

exports.getColorAnimID = () => {
    maxID += 1;
    colorIndexByID[maxID] = 0;
    return maxID;
};

exports.getNextColor = (anim_id) => {   
    if(colorIndexByID[anim_id] == highest_index)
        colorIndexByID[anim_id] = 0;
    
    return colors[++colorIndexByID[anim_id]];
};

//Credit: https://stackoverflow.com/a/2880929/
exports.getURLParameters = function (q) {
    var match,
        pl     = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
        query  = q.substring(1);
  
    let urlParams = {};
    while (match = search.exec(query))
       urlParams[decode(match[1])] = decode(match[2]);
    return urlParams;
};
