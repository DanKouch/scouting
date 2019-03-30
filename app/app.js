const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const express = require("express")
const mongoose = require('mongoose');
const winston = require('winston');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require("passport");
const passportLocal = require('passport-local');
const MongoStore = require('connect-mongo')(session);

const tba = require("../tba.js");


module.exports = (app) => {

    // Configure body parser
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(cookieParser(process.env.COOKIE_SECRET || "insecure"));

    // Set up public folders
    app.use("/", express.static('./bower_components'));
    app.use("/", express.static('./public'));
    
    // Configure app
    app.set("view engine", "pug");
    app.set('views', './app/views');

    // Configure Sessions
    app.use(session({
        secret: process.env.COOKIE_SECRET || "insecure",
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
            mongooseConnection: mongoose.connection
        })
    }));

    // Set up flash alerts
    app.use(flash())

    // Configure Passport
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
    passport.use(new passportLocal.Strategy({
        session: true,
        usernameField: "email"
    }, require("./../authentication.js")));

    // Login Redirection (as Middlewear)
    app.use((req, res, next) => {
        if(!req.isAuthenticated() && req.url != "/login")
            res.redirect("/login")
        if(req.url == "/login" && req.isAuthenticated())
            res.redirect("/")

        // Inject TBA data into the request
        tba.getData((data) => {
            req.tba = data;
            next()
        })
    })

    // Base Routing
    app.use("/", require("./router.js"));
}