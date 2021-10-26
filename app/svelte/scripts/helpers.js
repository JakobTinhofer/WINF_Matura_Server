exports.convertToBool = (val) => {
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
}