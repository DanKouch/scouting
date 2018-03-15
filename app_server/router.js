'use strict';

// Modules to setup
const express = require('express');
const passport = require("passport");
const winston = require("winston");
const flash = require("connect-flash");
const controller = require("./controller");
const config = require("../config.js");
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
			teamName: config.teamName,
			errorMessages: {
				login: req.flash('error')
			}
		});
	}
});

router.get("/register", ensureAdministrator, (req, res) => {
   res.render("register", {
   	user: req.user,
   	teamName: config.teamName,
   	errorMessages: [],
   	errorFields: [],
   	canChooseRole: req.query.canChooseRole && req.query.canChooseRole == "true"
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
	res.render('home', { user: req.user, teamName: config.teamName });
});

// Administrator pages
router.get('/users', ensureAdministrator, controller.users);
router.delete('/user', ensureAdministrator, controller.deleteUser);
router.put('/user/password', ensureAdministrator, controller.changeUserPassword);


router.get('/pit-scouting-reports', ensureLoggedIn, controller.pitScoutingReports);
router.get('/pit-scouting-reports.csv', controller.pitScoutingReportsCsv);
router.get('/match-scouting-reports', ensureLoggedIn, controller.matchScoutingReports)
router.get('/match-scouting-reports.csv', controller.matchScoutingReportsCsv);

// Forms
router.get('/pit-scouting-report', ensureLoggedIn, function(req, res){
	res.render('pitScoutingReport', { user: req.user, teamName: config.teamName, tournament: config.tournament, teams: config.teams});
});
router.post("/pit-scouting-report", controller.postPitScoutingReport);

router.get('/match-scouting-report', ensureLoggedIn, function(req, res){
	res.render('matchScoutingReport', { user: req.user, teamName: config.teamName, tournament: config.tournament, teams: config.teams});
});
router.post("/match-scouting-report", controller.postMatchScoutingReport);

// Webdata
router.get("/"+config.secret.webDataPath, controller.getWebData)



module.exports = router;