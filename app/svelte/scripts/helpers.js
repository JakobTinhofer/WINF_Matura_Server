

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

exports.getRandomColor = () => {  
    return colors[Math.floor(Math.random() * colors.length - 1)];
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

//Creadit: https://stackoverflow.com/a/8630641
exports.createCSSSelector = (selector, style) => {
    if (!document.styleSheets) return;
    if (document.getElementsByTagName('head').length == 0) return;
  
    var styleSheet,mediaType;
  
    if (document.styleSheets.length > 0) {
      for (var i = 0, l = document.styleSheets.length; i < l; i++) {
        if (document.styleSheets[i].disabled) 
          continue;
        console.debug(document.styleSheets[i]);
        var media = document.styleSheets[i].media;
        mediaType = typeof media;
  
        if (mediaType === 'string') {
          if (media === '' || (media.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
          }
        }
        else if (mediaType=='object') {
          if (media.mediaText === '' || (media.mediaText.indexOf('screen') !== -1)) {
            styleSheet = document.styleSheets[i];
          }
        }
  
        if (typeof styleSheet !== 'undefined') 
          break;
      }
    }
  
    if (typeof styleSheet === 'undefined') {
      var styleSheetElement = document.createElement('style');
      styleSheetElement.type = 'text/css';
      document.getElementsByTagName('head')[0].appendChild(styleSheetElement);
  
      for (i = 0; i < document.styleSheets.length; i++) {
        if (document.styleSheets[i].disabled) {
          continue;
        }
        styleSheet = document.styleSheets[i];
      }
  
      mediaType = typeof styleSheet.media;
    }
  
    if (mediaType === 'string') {
      for (var i = 0, l = styleSheet.rules.length; i < l; i++) {
        if(styleSheet.rules[i].selectorText && styleSheet.rules[i].selectorText.toLowerCase()==selector.toLowerCase()) {
          styleSheet.rules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.addRule(selector,style);
    }
    else if (mediaType === 'object') {
      var styleSheetLength = (styleSheet.cssRules) ? styleSheet.cssRules.length : 0;
      for (var i = 0; i < styleSheetLength; i++) {
        if (styleSheet.cssRules[i].selectorText && styleSheet.cssRules[i].selectorText.toLowerCase() == selector.toLowerCase()) {
          styleSheet.cssRules[i].style.cssText = style;
          return;
        }
      }
      styleSheet.insertRule(selector + '{' + "background-color: red" + '}', styleSheetLength);
    }
  }