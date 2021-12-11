const statusController = require('./statusController');
const Tag = require('../models/Tag');
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const userController = require("./userController");
const validator = require("../../common/validators");
const Site = require("../models/Site");

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

    const { tag_name, tag_color, min_sec, can_sort } = req.body;

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

exports.modifySiteTags = async (req, res) => {
    if(!await userController.require_login(req, res, 5)) return;
    let { id, tagsToAdd, tagsToRemove } = req.body;
    

    if(tagsToAdd instanceof Array && tagsToRemove instanceof Array && id instanceof String){
        const site = await Site.findOne({hex_id: String(id)});
        if(site){
            if(site.author.username !== req.session.username && req.session.sec_level < 8){
                statusController.putJSONError(req, res, new Error("Modify Tags Error", "You are not allowed to modify the tags of this site!", 403, 0));
                console.log("User tried to modify tags of site that is not his!");
                return;
            }


            tagsToAdd = [...new Set(tagsToAdd)];
            tagsToRemove = [...new Set(tagsToRemove)];

            let totalTags = await Tag.find({name: {$in: Array.concat(tagsToRemove, tagsToAdd)}});
            for(const t of totalTags){
                if(t.min_sec_level > req.session.user.sec_level){
                    statusController.putJSONError(req, res, new Error("Modify Tags Error", "You are not allowed to use the '" + t.name + "' tag!", 403, 1));
                    console.log("User tried to modify tags but was not allowed to use those tags!");
                    return;
                }
            }

            for(const t of tagsToAdd){
                if(!site.tags.includes(t) && t instanceof String){
                    site.tags.concat(t)
                }
            }
            for(const t of tagsToRemove){
                let index = site.tags.indexOf(t);
                if(index > -1 && t instanceof String){
                    site.tags.splice(index, 1);
                }
            }

            Site.save();
            console.log("Successfully modified tags for site!");
        }else{
            statusController.putJSONError(req, res, new Error("Modify Tags Error", "The given id is invalid, or the site does not exist anymore.", 404, 2));
            console.log("Tried to modify tags of nonexistend site!");
            return;
        }
    }else{
        statusController.putJSONError(req, res, new Error("Modify Tags Error", "The id must be of type string, while tagsToAdd and tagsToRemove must be arrays!", 400, 3));
        console.log("User " + req.session.user.username + " tried to modify tags using objects of wrong type!");
        return;
    }

    
}