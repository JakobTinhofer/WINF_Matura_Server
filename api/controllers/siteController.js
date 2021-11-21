const Site = require("../models/Site");
const User = require("../models/User");
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const helpers = require("../helpers");
const statusController = require("./statusController");
const userController = require("./userController");
const { request } = require("express");
const path = require('path');
const fs = require('fs');
const { Console } = require("console");
const formidable = require("formidable");
const { title } = require("process");

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
    
    let dirPath = process.env['SITE_PATH'] + "/" + siteId;

    

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
        let {title, isPublic, entryFile} = fields;

        if(err){
            console.log("Error while parsing form: " + err);
            statusController.putJSONError(req, res, new Error("Create Site Error", "Error while parsing form", 400));
            return;
        }

        console.log(`Creating site '${title}'. IsPublic: ${isPublic} and Entry: ${entryFile}.'`);
        

        if(!title || title.length < 2 || title.length > 40){
            statusController.putJSONError(req, res, new Error("Create Site Error", "The title you provided was invalid. Please provide a title of length between 5 and 40 characters.", 400, 0));
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
    
        console.log("Successfully created new site! Site id: " +siteId);
        statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully created new site", siteId));
    });

    
    
}

exports.getSiteByPath = async (req, res) => {
    const {pathEnd} = req.query;

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

    const sitePath = reqPath.split("/").shift();

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

        var combined_path = path.join(process.env['SITE_PATH'], reqPath);
        if(!combined_path.startsWith(path.join(process.env['SITE_PATH'], s.dir_path_end))){
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
    const {filter} = req.query;

    if(!await userController.require_login(req, res)){
        console.log("Couldn't query pages since user not logged in.");
        return;
    }

    if(filter){
        console.log("Filter not yet implemented.");
        statusController.putJSONError(req, res, new Error("Get Pages Error", "Filters are not yet implemented. Sorry.", 501, -100));
        return;
    }

    let pages = await Site.find({ $or: [{"author.username": req.session.user.username}, {isPublic: true}]});

    statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully retrieved sites.", pages));
    console.log(`User ${req.session.user.username} retrieved ${pages.length} sites.`);
}


exports.getEditFields = async (req, res) => {
    const {id} = req.query;

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
        let dirPath = process.env['SITE_PATH'] + "/" + s.dir_path_end;
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
    const { id, title, additional_files, files_to_remove, start_page, isPublic } = req.query;

    if(!await userController.require_login(req, res)){
        console.log("Could not return edit fields since user not logged in.");
        return;
    }

    if(!id){
        console.log("No site id provided for edit.");
        statusController.putJSONError(req, res, new Error("Edit Site Error", "No site id was provided."));
        return;
    }

    if(!title || title.length < 2 || title.length > 40){
        statusController.putJSONError(req, res, new Error("Edit Site Error", "The title you provided was invalid. Please provide a title of length between 5 and 40 characters.", 400, 0));
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
        let dirPath = process.env['SITE_PATH'] + "/" + id;



        if(!fs.existsSync(dirPath)){
            statusController.putJSONError(req, res, new Error("Edit Site Error", "Somehow, your site got lost. We are sorry. :(", 500, 123));
            console.log("Fatal Error: Cannot find site on disk, but it is in DB! Site id: " + s.id);
            return;
        }

        if(files_to_remove){
            for(ftr in files_to_remove){
                p = path.normalize(dirPath + "/" + ftr)
                if(!p.startsWith(dirPath)){
                    statusController.putJSONError(req, res, new Error("Edit Site Error", "No path traversal here, carry on!", 403, 11231));
                    console.log(`Detected path traversal attempt by user ${req.session.user.username}! Tried to remove ${p}.`);
                    return;
                }
                if(!fs.existsSync(p) || fs.lstatSync(path_string).isDirectory()){
                    statusController.putJSONError(req, res, new Error("Edit Site Error", `The file ${ftr} does either not exist, or it is a directory! No changes have been made.`));
                    console.log("File to remove does not exist or is directory.");
                    return;
                }
            }

            for(ftr in files_to_remove){
                fs.rmSync(dirPath + "/" + ftr);
                console.log("Removed file " + ftr);
                return;
            }
        }

        
        let remFiles = fs.readdirSync(dirPath);
        

        const form = formidable({
            keepExtensions: true,
            uploadDir: dirPath,
        });  

        form.on('file', function(field, file) {
            p = path.normalize( form.uploadDir + "/" + nameCreator9000(file.name))
            if(fs.existsSync(p)){
                if(!fs.lstatSync(p).isDirectory()){
                    fs.rmSync(p)
                    console.log("Overwrote file " + file.name);
                }else{
                    console.log("Could not upload file " + file.name + " since there is a directory of the same name!");
                    return;
                }
            }
            fs.rename(file.path, form.uploadDir + "/" + nameCreator9000(file.name), ()=> {});
        });

        form.parse(req, (err, fields, files) => {
            if(err){
                console.log("Error while parsing form: " + err);
                statusController.putJSONError(req, res, new Error("Create Site Error", "Error while parsing form", 400));
                return;
            }

            console.log(`Editing site '${title}'. IsPublic: ${isPublic} and Entry: ${entryFile}.'`);


        
            if((!files || files.length === 0) && remFiles.length === 0){
                statusController.putJSONError(req, res, new Error("Edit Site Error", "This site needs atleast one file.", 400, 3));
                console.log("No files provided, but all files of site deleted.");
                return;
            }

            if(!files[entryFile] && !remFiles.includes(start_page)){
                statusController.putJSONError(req, res, new Error("Edit Site Error", "Invalid entry file.", 400, 4));
                console.log("Invalid entry file.");
                return;
            }

            s.isPublic = isPublic;
            s.start_file = start_page;
            s.title = title;
            
            s.save();

            console.log("Successfully edited site  " + id  + ".");
            statusController.putJSONSuccess(req, res, new SuccessMessage("Successfully edited new site", id));
        });
    }
}