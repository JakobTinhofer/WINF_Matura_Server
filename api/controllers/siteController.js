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
        

        if(!title || isPublic === undefined){
            statusController.putJSONError(req, res, new Error("Create Site Error", "Please provide all fields.", 400, 0));
            console.log("Could not create new site since one of the fields was not provided.");
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
            isPublic: isPublic === true ||isPublic === 'true' || isPublic === 'on',
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