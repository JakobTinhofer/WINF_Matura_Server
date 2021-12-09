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
                process.env["SITE_PATH"] = args[i + 1];
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

if(process.env["DEV_MODE"] === "true"){
    process.env["DEV_MODE"] = true;
}

if(!process.env["PORT"]){
    console.log("No port provided or port invalid, assuming 3000.");
    process.env["PORT"] = 3000;
}

if(!process.env["HOSTNAME"]){
    console.log("No hostname provided, assuming localhost.");
    process.env["HOSTNAME"] = "localhost";
}