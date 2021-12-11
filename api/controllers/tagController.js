const statusController = require('./statusController');
const Tag = require('../models/Tag');
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const userController = require("./userController");
const validator = require("../../common/validators");

exports.getAllTags = async (req, res) => {
    if(await userController.require_login(req, res) !== true){
        console.log("Could not return tags since user not logged in.");
        return;
    }

    const tags = await Tag.find({min_sec_level: {$lte: req.session.user.sec_level}});
    
    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully retrieved tags", tags.length > 0 ? tags : []));
    console.log("Successfully retrieved " + tags.length + " tags");
}

exports.createNewTag = async (req, res) => {
    if(!await userController.require_login(req, res, 5)){
        console.log("Could not create tag since user not logged in, or sec rank to low.");
        return;
    }

    const { tag_name, tag_color, min_sec, can_sort } = req.query;

    var rs = validator.validateTagName(tag_name);
    if(rs[0] !== true){
        statusController.putJSONError(req, res, new Error("Create Tag Error", "Invalid tag name: " + rs[2], 400, 0));
        console.log("Invalid tag name!");
        return;
    }
    rs = validator.validateColor(tag_color);
    if(rs[0] !== true){
        statusController.putJSONError(req, res, new Error("Create Tag Error", "Invalid color: " + rs[2], 400, 1));
        console.log("Invalid color!");
        return;
    }

    rs = validator.validateSecLevel(min_sec, req.session.user.sec_level);
    if(rs[0] !== true){
        statusController.putJSONError(req, res, new Error("Create Tag Error", "Invalid sec level: " + rs[2], 400, 2));
        console.log("Invalid sec level!");
        return;
    }

    var t = await Tag.findOne({name: tag_name});

    if(t === null){
        t = new Tag({
            name: tag_name,
            color: tag_color,
            min_sec_level: min_sec,
            can_sort: can_sort !== false,
        });
        t.save();
        console.log("Added new tag '" + tag_name + "'.");
        statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully added tag"));
    }else{
        console.log("Tag '" + tag_name + "' already exists!");
        statusController.putJSONError(req, res, new Error("Create Tag Error", "This tag already exists!", 400, 3));
    }
}