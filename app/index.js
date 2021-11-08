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
    res.sendFile("./svelte/public/index.html", {root: path.join(__dirname)});
});


module.exports = app;