const fs = require('fs');
const path = require('path');
const { exit } = require('process');
require("dotenv").config();
var args = process.argv.slice(2);

for (let i = 0; i < args.length; i++){
    switch(args[i].toLocaleLowerCase()){
        case "--mongo":
        case "-m":
        case "--mongo-ip":
        case "-mip":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["MONGO_IP"] = args[i + 1];
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for mongo ip is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "-pw":
        case "--gmail-password":
        case "--mail-password":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["GMAIL_PASSWORD"] = args[i + 1];
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for gmail password is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "-gu":
        case "--gmail-user":
        case "--mail-user":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["GMAIL_USER"] = args[i + 1];
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for gmail user is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--debug":
        case "--dev":
        case "-d":
            console.log("Development mode enabled.");
            process.env["DEV_MODE"] = true;
            break;
        case "--site_path":
        case "--path":
        case "-s":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["SITE_PATH"] = path.normalize(args[i + 1]);
                if(!fs.existsSync(process.env["SITE_PATH"])){
                    console.log("Site path '" + process.env["SITE_PATH"] + "' does not exist! Exiting now...");
                    exit(-555);
                }
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for site path is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--host":
        case "-h":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["HOSTNAME"] = args[i + 1];
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for the hostname is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--port":
        case "-p":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["PORT"] = Number(args[i + 1]);
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for the port is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--https-port":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["HTTPS_PORT"] = Number(args[i + 1]);
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for the https port is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--ssl-key-path":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["SSLKEY_PATH"] = path.normalize(args[i + 1]);
                if(!fs.existsSync(process.env["SSLKEY_PATH"])){
                    console.log("SSL key not found! Exiting now...");
                    exit(-555);
                }
                if(fs.lstatSync(process.env["SSLKEY_PATH"]).isDirectory()){
                    console.log("SSL key path is directory! Exiting now...");
                    exit(-555);
                }
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for the ssl key path is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        case "--ssl-cert-path":
            if(i + 1 < args.length && !args[i + 1].startsWith("-")){
                process.env["SSLCERT_PATH"] = path.normalize(args[i + 1]);
                if(!fs.existsSync(process.env["SSLCERT_PATH"])){
                    console.log("SSL cert not found! Exiting now...");
                    exit(-555);
                }
                if(fs.lstatSync(process.env["SSLCERT_PATH"]).isDirectory()){
                    console.log("SSL cert path is directory! Exiting now...");
                    exit(-555);
                }
                i++;
            }
            else{
                console.log("Invalid argument! Either the value provided for the ssl cert is an argument itsself, or it is not provided!");
                process.exit(1);
            }
            break;
        default:
            console.log("Unknown command line parameter: " + args[i]);
            process.exit(1);
   }
}

if(!process.env["SITE_PATH"]){
    console.log("Please add the --site_path argument.");
    process.exit(1);
}

if(!process.env["GMAIL_PASSWORD"]){
    console.log("No gmail password was passed.");
    process.exit(1);
}

if(!process.env["GMAIL_USER"]){
    console.log("No gmail username was passed.");
    process.exit(1);
}

if(process.env["DEV_MODE"] === "true"){
    process.env["DEV_MODE"] = true;
}

if(!process.env["PORT"]){
    let p = process.env["DEV_MODE"] ? 3000 : 80;
    console.log("No port provided or port invalid, assuming " + p + " since server is DEV_MODE=" + process.env["DEV_MODE"] + ".");
    process.env["PORT"] = p;
}else
    process.env["PORT"] = Number(process.env["PORT"])


if(!process.env["HOSTNAME"]){
    console.log("No hostname provided, assuming localhost.");
    process.env["HOSTNAME"] = "localhost";
}
if // Like XOR
(process.env["SSLKEY_PATH"] ? !process.env["SSLCERT_PATH"] : process.env["SSLCERT_PATH"]){
    console.log("Please provide both key and certificate, or none");
    process.exit(1);
}else if(process.env["SSLKEY_PATH"] && process.env["SSLCERT_PATH"]){
    process.env["ENABLE_HTTPS"] = true;
}

if(!process.env["HTTPS_PORT"] && process.env["ENABLE_HTTPS"]){
    let p = process.env["DEV_MODE"] ? 8080 : 443;
    console.log("No https port provided, using default port " + p + ".");
    process.env["HTTPS_PORT"] = p;
}
