require('./cmd_line_parse')
const express = require('express');
var vhost = require('vhost');
const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const bcrypt = require('bcrypt');
const cors = require('cors');
const readLine = require("readline");
const app = express();

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

if(!process.env["GMAIL_PASSWORD"]){
    console.log("Enter the gmail password: ");
    rl.on("line", (line) => {
        console.log("Read line: " + line);
        process.env["GMAIL_PASSWORD"]  = line.trim();
        initialize();
    });
}else{
    initialize();
}

function initialize(){
    if(process.env["DEV_MODE"]){
        app.use(cors());
        console.log("Warning: CORS allows all origins due to dev mode. This can be dangerous!");
    }else{
        app.use(cors({
    
    
        }));
    }
    
    app.use(cookieParser());
    app.use(express.json());
    app.use(require("./api/middleware/queryParser"))
    bcrypt.genSalt(10,(err,salt)=> 
    bcrypt.hash(process.memoryUsage().heapTotal + "That's mad fam." + process.hrtime()[1] + process.hrtime()[0], salt, (err,hash)=> {
        if(err){
            console.log("Error while trying to hash secret: " + err + "!!!!");
            process.exit(-1);
        }
        app.use(sessions({
            secret: hash,
            saveUninitialized:true,
            resave: false,
            cookie: {
                sameSite: 'Strict'
            }
        }));
        console.log("Enabled sessions!");
    
        if(process.env["DEV_MODE"]){
            app.use("/api", require('./api'))
                .use(require('./app'))
                .listen(process.env["PORT"]);
        }else{
            app.use(vhost('api.lightbluefox.xyz', require('./api')))
                .use(vhost("lightbluefox.xyz", require('./app')))
                .use(vhost("www.lightbluefox.xyz", (req, res) => {res.redirect("http://lightbluefox.xyz")}))
                .listen(80);
            ;
        }
    
        })
    );
}





