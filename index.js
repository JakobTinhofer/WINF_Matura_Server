require('./cmd_line_parse')
const express = require('express');
var vhost = require('vhost');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
var http = require('http');
initialize();

async function initialize(){
    console.log("Loading middleware...");
    await setMiddleWare();
    console.log("Loaded middleware.");

    if(process.env["ENABLE_HTTPS"]){
        console.log("Starting up HTTPS server...");
        await setUpHTTPS();
        console.log("Started set up HTTPS server.")
    }else{
        console.log("Starting HTTP server...")
        await setUpHTTP();
        console.log("Started HTTP server.");
    }
    console.log("Trying to drop root privilege if given...");

    // Root priv's needed to listen at low ports, but keeping those privs is high risk (vuln in app could lead to root access!)
    try{
        process.setgid("winf_app");
        process.setuid("winf_app");
        console.log("Successfully dropped priviledges. Now running as winf_app.");
    }catch{
        console.log("Could not drop root priviledges. Maybe we're already not root? Continuing anyways...");
    }
}

async function setMiddleWare(){
    app.use(cookieParser());
    console.log("--> Loaded cookieParser!");
    app.use(express.json());
    console.log("--> Loaded json body parser!");

    if(process.env["DEV_MODE"]){
        app.use(require("./api/middleware/queryParser"));
        console.log("--> Loaded queryParser!");
    }
        
    console.log("--> Loading sessions...");
    app.use(sessions({
        secret: await generateSessionSecret(),
        saveUninitialized:true,
        resave: false,
        cookie: {
            sameSite: 'Strict'
        }
    }));
    console.log("--> Loaded sessions!");

    app.use("/api", require('./api'))
        .use(require('./app'));
    console.log("--> Loaded routes.");
}

async function generateSessionSecret(){
    console.log("----> Generating secret...")
    var salt = await bcrypt.genSalt(10); 
    var secret = await bcrypt.hash(process.memoryUsage().heapTotal + "That's mad fam." + process.hrtime()[1] + process.hrtime()[0], salt);
    console.log("----> Generated secret!");
    return secret;
}

async function setUpHTTP(){
    let s = http.createServer(app);
    process.env["SERVER"] = s;
    s.listen(process.env["PORT"], '0.0.0.0')
    console.log("--> HTTP server listening on " + process.env["HOSTNAME"] + ":" + process.env["PORT"] + "...");
}



async function setUpHTTPS(){
    var fs = require('fs');
    console.log("--> Loaded fs module.");
    
    var https = require('https');
    console.log("--> Loaded https module.");

    console.log("--> Reading ssl credentials...");
    var privateKey, certificate;
    try {
        console.log("----> Trying to read ssl private key.");
        privateKey = fs.readFileSync(process.env["SSLKEY_PATH"]);
        console.log("----> Trying to read ssl certificate.");
        certificate = fs.readFileSync(process.env["SSLCERT_PATH"]);
    }catch(error){
        console.log("Error while reading SSL files. Maybe the right permissions have not been set? Error: " + error);
        process.exit(-551);
        return;
    }
    console.log("--> Successfully read private key and certificate.");
    var creds = {key: privateKey, cert: certificate}
    let s = https.createServer(creds, app);
    process.env["SERVER"] = s;
    s.listen(process.env["HTTPS_PORT"], '0.0.0.0');
    console.log("--> Started HTTPS server on " + process.env["HOSTNAME"] + ":" + process.env["HTTPS_PORT"] + "...")
    await setUpHTTPRedirect(process.env["HOSTNAME"], process.env["PORT"])
}



async function setUpHTTPRedirect(host, port){
    http.createServer(express().use((req, res, next) => {
        res.redirect("https://" + host + (process.env["HTTPS_PORT"] ? (":" + process.env["HTTPS_PORT"]) : "") + req.url);
    }).listen(port, '0.0.0.0'));
    console.log("--> Set up http to https redirect on port " + host + ":" + port + "...");
}





