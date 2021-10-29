var fs = require('fs');
var path = require('path');
var Template = require('./Template');

exports.templates = [];

exports.loadTemplate = async (path, name) => {
    if(path.split('.').pop() !== "html")
        throw "Needs to be ran on html files!";
    let t =  new Template(await fs.readFileSync(path, {encoding: 'utf-8'}));
    if(name)
        exports.templates[name] = t;
    else
        exports.templates[path.win32.basename(path)];
}

exports.getTemplate = (n) => {
    if(exports.templates[n])
        return exports.templates[n];
    else
        return exports.templates[path.win32.basename(n)];
}