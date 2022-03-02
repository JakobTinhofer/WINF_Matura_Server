const Site = require("../models/Site");
const User = require("../models/User");
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const helpers = require("../helpers");
const statusController = require("./statusController");
const userController = require("./userController");
const path = require('path');
const fs = require('fs');
const formidable = require("formidable");
const validator = require("../../common/validators")

const illegalChars = /[^A-z0-9äöü\-_.]/;
function nameCreator9000(name) {
    console.log("--> Saving file " + name);
    return String(name.replace(illegalChars, "_"));
}

function siteToSiteInfo(site) {
    return {
        author: helpers.userToUserInfo(site.author),
        dir_path_end: site.dir_path_end,
        start_file: site.start_file,
        title: site.title,
        isPublic: site.isPublic,
        hex_id: site.hex_id,

    }
}

exports.createSite  = async (req, res) => {
    
    

    if(!await userController.require_login(req, res))
            return;
    
    let siteId = "";
    let siteCheck;
    do{
        siteId = await helpers.getRandom3ByteHex();
        siteCheck = await Site.find({hex_id: siteId});
    }while(siteCheck && siteCheck.length !== 0)
    
    let dirPath = path.normalize(process.env['SITE_PATH'] + "/" + siteId);

    

    if(fs.existsSync(dirPath)){
        fs.rmdirSync(dirPath, { recursive: true, force: true });
        console.log("Found unkown site dir in SITE PATH. Removed it");
    }

    fs.mkdirSync(dirPath);   

    const form = formidable({
        keepExtensions: true,
        uploadDir: dirPath,
    });  

    form.on('file', function(field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, form.uploadDir + "/" + nameCreator9000(file.name), ()=> {});
    });

    form.parse(req, (err, fields, files) => {
        console.log(fields);
        let {title, isPublic, entryFile} = fields;

        if(err){
            console.log("Error while parsing form: " + err);
            statusController.putJSONError(req, res, new Error("Create Site Error", "Error while parsing form", 400));
            return;
        }

        console.log(`Creating site '${title}'. IsPublic: ${isPublic} and Entry: ${entryFile}.'`);
        

        const rs = validator.validateSiteTitle(title);
        if(rs[0] !== true){
            statusController.putJSONError(req, res, new Error("Create Site Error", "Invalid title: " + rs[2], 400, 1));
            console.log("Invalid title.");
            return;
        }

        if(entryFile === undefined){
            statusController.putJSONError(req, res, new Error("Create Site Error", "Please provide the entry file", 400, 2));
            console.log("No entry file provided.");
            return;
        }

        if(!files || files.length === 0){
            statusController.putJSONError(req, res, new Error("Create Site Error", "No files were provided.", 400, 3));
            console.log("No files provided.");
            return;
        }
        
        if(!files[entryFile]){
            statusController.putJSONError(req, res, new Error("Create Site Error", "Invalid entry file.", 400, 4));
            console.log("Invalid entry file.");
            return;
        }

        


        
            
            
        
        let s = new Site({
            isPublic: isPublic === true || isPublic === 'true' || isPublic === 'on',
            hex_id: siteId,
            dir_path_end: siteId,
            author: helpers.userToUserInfo(req.session.user),
            start_file: entryFile,
            title: title
        })
        console.log(s);
        s.save();
    
        console.log("Successfully created new site! Site id: " + siteId);
        statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully created new site", siteId));
    });

    
    
}

exports.getSiteByPath = async (req, res) => {
    const {pathEnd} = req.body;

    if(!pathEnd || illegalChars.test(pathEnd)){
        statusController.putJSONError(req, res, new Error("Get Site Error", "Please provide a valid site path", 400, 0));
        console.log("Could not get site due to invalid path");
        return;
    }
    
    let s = await Site.findOne({dir_path_end: pathEnd});

    if(s){
        statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully retrieved site info", siteToSiteInfo(s)));
        return;
    }else{
        statusController.putJSONError(req, res, new Error("Get Site Error", "Could not find any site with this path.", 404, 1));
        return;
    }
    
}

exports.getSiteContent = async (req, res) => {
    const reqPath = req.params[0].substring(1);

    if(!reqPath.includes("/") && !reqPath.endsWith("/")){
        res.redirect(req.baseUrl + "/" + reqPath + "/");
        return;
    }

    if(reqPath.endsWith("/resources/global.css")){
        res.sendFile('../../app/svelte/public/resources/global.css', {root: path.join(__dirname)});
        return;
    }

    if(reqPath.endsWith("/build/bundle.js")){
        res.sendFile('../../app/svelte/build/bundle.js', {root: path.join(__dirname)});
        return;
    }

    if(reqPath.endsWith("/build/bundle.css")){
        res.sendFile('../../app/svelte/build/bundle.css', {root: path.join(__dirname)});
        return;
    }

    const remPath = reqPath.split("/");
    const sitePath = remPath.shift();
    const remPathStr = remPath.join("/");

    if(!sitePath || illegalChars.test(sitePath)){
        statusController.putJSONError(req, res, new Error("Get Content Error", "The given path is invalid!", 400, 0));
        console.log("Could not server site content since path is invalid.");
        return;
    }

    let s = await Site.findOne({dir_path_end: sitePath});

    if(s){
        if(!s.isPublic){
            if(!await userController.require_login(req, res))
                return;
            if(req.session.user.username !== s.author.username){
                statusController.putJSONError(req, res, new Error("Get Content Error", "This site is private!", 403, 1));
                console.log("User tried to view private page that is not his.");
                return;
            }
        }

        var combined_path = path.join(path.join(process.env['SITE_PATH'], s.hex_id), remPathStr);
        if(!combined_path.startsWith(path.join(process.env['SITE_PATH'], s.hex_id))){
            statusController.putJSONError(req, res, new Error("Get Content Error", "You sneaky ****! No path traversals here!", 403, 2));
            console.log("Someone tried a path traversal! Request path: " + reqPath);
            return;
        }

        if(fs.existsSync(combined_path)){
            if(fs.lstatSync(combined_path).isDirectory()){
                combined_path = path.join(combined_path, s.start_file);
            }
            res.sendFile(combined_path);
        }else{
            statusController.putJSONError(req, res, new Error("Get Content Error", "The requested file has not been found.", 404, 3));
            console.log("Could not serve file as it was not found.");
            return;
        }    
    }else{
        statusController.putJSONError(req, res, new Error("Get Content Error", "The requested site has not been found.", 404, 4));
        console.log("Unknown site querried.");
        return;
    }
}

exports.getVisibleSitesByFilter = async (req, res) => {
    const {filter} = req.body;
    
    if(filter){
        console.log("Filter not yet implemented.");
        statusController.putJSONError(req, res, new Error("Get Pages Error", "Filters are not yet implemented. Sorry.", 501, -100));
        return;
    }
    let pages;
    if(req.session.authenticated === 1){
        pages = await Site.find({ $or: [{"author.username": req.session.user.username}, {isPublic: true}]});
        console.log(`User ${req.session.user.username} retrieved ${pages.length} sites.`);
    }else{
        pages = await Site.find({isPublic: true});
        console.log(`Anonymous user retrieved ${pages.length} sites.`);
    }
    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully retrieved sites.", pages));
    
}

exports.getEditFields = async (req, res) => {
    const {id} = req.body;

    if(!await userController.require_login(req, res)){
        console.log("Could not return edit fields since user not logged in.");
        return;
    }

    let s = await Site.findOne(({hex_id: id}));

    if(s){
        if(s.author.username !== req.session.user.username && req.session.user.sec_level < 8){
            console.log("Could not return edit fields since user is not authorized to edit this site!");
            statusController.putJSONError(req, res, new Error("Get Edit Fields Error", "You are not autorized to edit this site!", 403, 0));
            return;
        }
        let dirPath = process.env['SITE_PATH'] + "/" + s.hex_id;
        if(!fs.existsSync(dirPath)){
            console.log("Could not return edit fields since directory does not exist!");
            statusController.putJSONError(req, res, new Error("Get Edit Fields Error", "Somehow this page disappeared. Sorry mate!", 404, 2));
            return;
        }
        fs.readdir(dirPath, (err, files) => {
            if(err) { console.log("Error: " + err); return; }

            let fields = {
                "title": s.title,
                "files": files,
                "isPublic" : s.isPublic,
                "start_file": s.start_file
            }

            statusController.putJSONSuccess(req, res, new SuccessMessage("Retrieved Site Fields", fields));
            //Hello there!
        });

    }else{
        statusController.putJSONError(req, res, new Error("Get Edit Fields Error", "This site has not been found!", 404, 1));
        console.log("Could not get edit fields since site was not found!");
        return;
    }
}

exports.editSite = async (req, res) => {
    const { id, title, isPublic, entryFile } = req.query;
    let files_to_remove = req.query["files_to_remove"].split(",");
    if(files_to_remove.length === 1 && files_to_remove[1] ==="")
        files_to_remove = [];
    if(!await userController.require_login(req, res)){
        console.log("Could not edit site since user not logged in.");
        return;
    }

    if(!id){
        console.log("No site id provided for edit.");
        statusController.putJSONError(req, res, new Error("Edit Site Error", "No site id was provided."));
        return;
    }

    const rs = validator.validateSiteTitle(title);
    if(rs[0] !== true){
        statusController.putJSONError(req, res, new Error("Create Site Error", "Invalid title: " + rs[2], 400, 1));
        console.log("Invalid title.");
        return;
    }

    if(entryFile === undefined){
        statusController.putJSONError(req, res, new Error("Edit Site Error", "Please provide the entry file", 400, 2));
        console.log("No entry file provided.");
        return;
    }


    let s = await Site.findOne(({hex_id: id}));

    if(s){
        if(s.author.username !== req.session.user.username && req.session.user.sec_level < 10){
            statusController.putJSONError(req, res, new Error("Edit Site Error", "You are not allowed to do this!", 403, 99));
            console.log(`User ${req.session.user.username} tried to edit the page of another user!`);
            return;
        }
        let dirPath = process.env['SITE_PATH'] + "/" + s.hex_id;



        if(!fs.existsSync(dirPath)){
            statusController.putJSONError(req, res, new Error("Edit Site Error", "Somehow, your site got lost. We are sorry. :(", 500, 123));
            console.log("Fatal Error: Cannot find site on disk, but it is in DB! Site id: " + s.id);
            return;
        }
        let remFiles = fs.readdirSync(dirPath);
        if(files_to_remove){
            for(const ftr of files_to_remove){
                if(ftr === "")
                    continue;
                p = path.normalize(dirPath + "/" + ftr)
                if(!p.startsWith(path.normalize(dirPath))){
                    statusController.putJSONError(req, res, new Error("Edit Site Error", "No path traversal here!", 403, 11231));
                    console.log(`Detected path traversal attempt by user ${req.session.user.username}! Tried to remove ${p}.`);
                    return;
                }
                if(!fs.existsSync(p) || fs.lstatSync(p).isDirectory()){
                    statusController.putJSONError(req, res, new Error("Edit Site Error", `The file ${ftr} does either not exist, or it is a directory! No changes have been made.`));
                    console.log("File to remove does not exist or is directory.");
                    return;
                }
                let i = remFiles.indexOf(ftr);
                if(i >= 0)
                    remFiles.splice(i, 1);
            }

        }

        
        
        
        let files_to_rename = []

        const form = formidable({
            keepExtensions: true,
            uploadDir: dirPath,
        });  

        form.on('file', function(field, file) {
            p = path.normalize( form.uploadDir + "/" + nameCreator9000(file.name))
            if(fs.existsSync(p)){
                if(!fs.lstatSync(p).isDirectory()){
                    files_to_remove[files_to_remove.length] = p.replace(form.uploadDir + "/", "");
                    console.log("Overwriting file " + file.name);
                }else{
                    console.log("Could not upload file " + file.name + " since there is a directory of the same name!");
                    return;
                }
            }
            console.log("Received file " + file.name)
            files_to_rename[files_to_rename.length] = ([file.path, form.uploadDir + "/" + nameCreator9000(file.name)]);
        });

        form.parse(req, (err, fields, files) => {
            if(err){
                console.log("Error while parsing form: " + err);
                statusController.putJSONError(req, res, new Error("Create Site Error", "Error while parsing form", 400));
                return;
            }

            console.log(`Editing site '${title}'. IsPublic: ${isPublic} and Entry: ${entryFile}.'`);


        
            if(!files && remFiles.length === 0){
                statusController.putJSONError(req, res, new Error("Edit Site Error", "This site needs atleast one file.", 400, 3));
                console.log("No files provided, but all files of site deleted.");
                return;
            }

            if(!files[entryFile] && !remFiles.includes(entryFile)){
                statusController.putJSONError(req, res, new Error("Edit Site Error", "Invalid entry file.", 400, 4));
                console.log("Invalid entry file.");
                return;
            }

            for(const ftr of files_to_remove){
                if(ftr === "")
                    continue;
                fs.rm(dirPath + "/" + ftr, () => {});
                console.log("Removed file " + ftr);
            }

            for(const f2rn of files_to_rename){
                fs.rename(f2rn[0], f2rn[1], () => {});
                console.log("mv'd file " + f2rn[0] + " to " + f2rn[1]);
            }

            s.isPublic = isPublic;
            s.start_file = entryFile;
            s.title = title;
            
            s.save();

            console.log("Successfully edited site  " + id  + ".");
            statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully edited new site", id));
        });
    }


}

exports.deleteSite = async (req, res) => {
    const {id} = req.body;

    if(!await userController.require_login(req, res))
            return;

    let s = await Site.findOne({hex_id: id});
    
    if(s){
        if(s.author.username === req.session.user.username || req.session.user.sec_level >= 10){
            let dirPath = path.normalize(process.env['SITE_PATH'] + "/" + id);
            if(!dirPath.startsWith(path.normalize(process.env['SITE_PATH'] + "/" + id))){
                console.log("Id of page " + id + " seems to trigger a path traversal! How?!?!");
                statusController.putJSONError(req, res, new Error("Delete Site Error", "Sorry, we cannot delete the site due to an internal error.", 500));
                return;
            }
            if(fs.existsSync(dirPath)){
                fs.rmdirSync(dirPath, {recursive: true, force: true});
                console.log("Removed site at " + dirPath);
            }else{
                console.log("Error: Path to remove does not exist!!!!!! Still removing site from DB.");
            }
            await Site.findOneAndDelete({hex_id: id});
            statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully deleted site!"));
            return;
        }else{
            console.log("User " + req.session.user.username + " tried to delete site he was not allowed to delete!")
        }
    }else
        console.log("User tried to delete unknown site!");

    
    statusController.putJSONError(req, res, new Error("Delete Site Error", "Either this site does not exist, or you don't have the permission to delete it!", 400));

}

exports.setCustomPath = async (req, res) => {
    const {id, customPath} = req.body;

    if(!await userController.require_login(req, res)){
        console.log("Could not set custom path since user not logged in.");
        return;
    }

    const check = validator.validateCustomPath(customPath);
    if(!check[0]){
        console.log("Could not change path since path is invalid!");
        statusController.putJSONError(req, res, new Error("Set Custom Path Error", "Sorry, your path is invalid: " + check[2], 400, 0));
        return;
    }

    var s = await Site.findOne({hex_id: id});
    if(s){
        if(s.author.username === req.session.user.username || req.session.sec_level >= 10){
            const s2 = await Site.findOne({dir_path_end: customPath});
            if(s2){
                console.log("Could not change path since path is already taken!");
                statusController.putJSONError(req, res, new Error("Set Custom Path Error", "Sorry, this path is already taken.", 400, 1));
                return;
            }
            s.dir_path_end = customPath;
            s.save();
            statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully updated custom path"));
            console.log("Updated custom path");
            return;
        }
    }
    statusController.putJSONError(req, res, new Error("Set Custom Path Error", "Sorry, either this site does not exist, or you are not allowed to access it!"));
    console.log("Could not update custom path since not found or not required permissions.");
}