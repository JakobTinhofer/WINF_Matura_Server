var Error = require("../classes/Error");
var SuccessMessage = require('../classes/SuccessMessage'); 

exports.putJSONError = (req, res, error) => {
    if(error instanceof Error){
        res.status(error.status ?? 400);
        res.json(JSON.stringify(error));
    }
}

exports.putJSONSuccess = (req, res, msg) => {
    if(msg instanceof SuccessMessage){
        res.status = 200;
        res.json(JSON.stringify(msg));
    }
}