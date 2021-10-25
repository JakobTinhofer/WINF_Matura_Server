require('./config');
const express = require('express');
const app = express();

const formidable = require('express-formidable');

app.use(formidable());

app.use(require('./routes'))
module.exports = app;