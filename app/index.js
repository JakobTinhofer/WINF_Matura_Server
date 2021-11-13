const express = require('express');
const app = express();
const path = require('path');

if(!process.env["DEV_MODE"]){
    app.use("/api/*", (req, res) => {
        res.redirect("api.lightbluefox.xyz/" + req.params[0]);
    });
}

app.use("/resources", express.static(path.join(__dirname, "./svelte/public/resources")));
app.use("/build", express.static(path.join(__dirname, "./svelte/public/build")));

app.get("/test", (req, res) => {
    res.json({'jes' : '1'});
});

app.get("*", (req, res) => {
    let reqPath = req.path;

    if(reqPath.endsWith("/resources/global.css")){
        res.sendFile('./svelte/public/resources/global.css', {root: path.join(__dirname)});
        return;
    }

    if(reqPath.endsWith("/build/bundle.js")){
        res.sendFile('./svelte/build/bundle.js', {root: path.join(__dirname)});
        return;
    }

    if(reqPath.endsWith("/build/bundle.css")){
        res.sendFile('./svelte/build/bundle.css', {root: path.join(__dirname)});
        return;
    }

    res.sendFile("./svelte/public/index.html", {root: path.join(__dirname)});
});


module.exports = app;