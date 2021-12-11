export default function (req, res, next){
    for(let q in req.query){
        console.log("Query param: " + q);
    }
    next();
}