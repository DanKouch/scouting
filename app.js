'use strict';

// Import NPM Modules
const express = require('express');
const passport = require("passport");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require("connect-flash");
const cookieParser = require('cookie-parser');
const passportLocal = require('passport-local');
const winston = require('winston');

const app = express();
const api = express();

// Dot Env Configuration
require('dotenv').config()

// Configure Winston logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true, 'colorize': true, 'level': "silly"})


// Used for reference
const config = require("./config.js");

// Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(config.secret.passportSessionSecret));

// Import local modules
const databaseScript = require("./database.js");
const authenticationScript = require("./authentication.js");

// Sessions
app.use(session({
  secret: config.secret.passportSessionSecret,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
  	mongooseConnection: mongoose.connection
  })
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

const User = mongoose.model("User");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new passportLocal.Strategy({session: true}, authenticationScript.authenticate));

// Initialize flash
app.use(flash());

// Set up public folders
app.use("/", express.static('./bower_components'));
app.use("/", express.static('./public'));

// Configure app
app.set("view engine", "pug");
app.set('views', './app_server/views');

// Base routing
app.use("/", require("./app_server/router.js"));
api.use("/", require("./app_api/router.js"));

// Start App HTTP server
app.set('port', config.appPort);

app.listen(app.get('port'), () => {
  winston.info("App HTTP server started on port " + app.get('port'));
});

// Start API HTTP server
api.set('port', config.apiPort);

api.listen(api.get('port'), () => {
  winston.info("API HTTP server started on port " + api.get('port'));
});