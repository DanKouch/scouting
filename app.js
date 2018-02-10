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
const apiApp = express();

// Configure Winston logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true, 'colorize': true, 'level': "silly"})


// Used for reference
const secret = require("./secret.js");

// Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(secret.passportSessionSecret));

// Import local modules
const databaseScript = require("./database.js");
const authenticationScript = require("./authentication.js");

// Sessions
app.use(session({
  secret: secret.passportSessionSecret,
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

// Routing
app.use("/", require("./app_server/router.js"));
apiApp.use("/", require("./app_api/router.js"));

// Start HTTP server
app.set('port', process.env.PORT || 3001);
apiApp.set('port', process.env.API_PORT || 3005);

app.listen(app.get('port'), () => {
	winston.info("HTTP server started on port " + app.get('port'));
});

apiApp.listen(apiApp.get('port'), () => {
  winston.info("HTTP API server started on port " + apiApp.get('port'));
});