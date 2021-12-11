module.exports =  function (req, res, next){
    for(let q in req.query){
        req.body[q] = req.query[q];
    }
    next();
}