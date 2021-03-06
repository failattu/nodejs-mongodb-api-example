var mongoose = require('mongoose');

var passport = require('passport');

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var cors = require('./app/cors');

var config = require('./app/config');
mongoose.connect(config.database);

var app = express();

app.use(cors);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());

require('./app/routes.js')(app);

module.exports = app;
