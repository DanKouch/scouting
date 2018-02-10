'use strict';

// Modules to setup
const express = require('express');
const passport = require("passport");
const winston = require("winston");
const flash = require("connect-flash");
const secret = require("../secret.js")
const controller = require("./controller");
var router = express.Router();

const ensureLoggedIn = (req, res, next) => { req.isAuthenticated() ? next() : res.redirect("/login"); }
const ensureAdministrator = (req, res, next) => { req.isAuthenticated() && (req.user.role == "administrator") ? next() : res.redirect("/login"); }


// Login and registration
router.get('/', (req, res) => {
	res.redirect(req.isAuthenticated ? "/home" : "/login")
});

router.get("/login", (req, res) => {
	if(req.isAuthenticated()){
		res.redirect("/");
	}else{
		res.render("login", {
			errorMessages: {
				login: req.flash('error')
			}
		});
	}
});

router.get("/register", ensureAdministrator, (req, res) => {
   res.render("register", {
   	user: req.user,
   	errorMessages: [],
   	errorFields: []
   });
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

router.post("/register", controller.postRegister);
router.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login', failureFlash: "Invalid username/password."}));

// User pages
router.get('/home', ensureLoggedIn, function(req, res){
	res.render('home', { user: req.user });
});

// Administrator pages
router.get('/users', ensureAdministrator, controller.users);
router.get('/pit-scouting-reports', ensureAdministrator, controller.pitScoutingReports);
router.get('/match-scouting-reports', ensureAdministrator, controller.matchScoutingReports);

// Forms
router.get('/pit-scouting-report', ensureLoggedIn, function(req, res){
	res.render('pitScoutingReport', { user: req.user });
});
router.post("/pit-scouting-report", controller.postPitScoutingReport);

router.get('/match-scouting-report', ensureLoggedIn, function(req, res){
	res.render('matchScoutingReport', { user: req.user });
});
router.post("/match-scouting-report", controller.postMatchScoutingReport);

// Webdata
router.get("/"+secret.webDataPath, controller.getWebData)



module.exports = router;