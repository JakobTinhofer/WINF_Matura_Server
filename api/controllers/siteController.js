const Site = require("../models/Site");
const User = require("../models/User");
const Error = require("../classes/Error");
const SuccessMessage = require("../classes/SuccessMessage");
const helpers = require("../helpers");
const statusController = require("./statusController");
const userController = require("./userController");
const { request } = require("express");
const fs = require('fs');
const { Console } = require("console");
const formidable = require("formidable");
const { title } = require("process");

const illegalChars = /[^A-z0-9äöü\-_.]/;
function nameCreator9000(name) {
    console.log("--> Saving file " + name);
    return String(name.replace(illegalChars, "_"));
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
            isPublic: isPublic === 'on',
            hex_id: siteId,
            dir_path: dirPath,
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


exports.getSiteById = async (req, res) => {
    console.log("Here")
}