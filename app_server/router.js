'use strict';

// Modules to setup
const express = require('express');
const passport = require("passport");
const winston = require("winston");
const flash = require("connect-flash");
const accountsController = require("./accountsController");
var router = express.Router();

const ensureLoggedIn = (req, res, next) => { req.isAuthenticated() ? next() : res.redirect("/login"); }

// Routes
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

router.get('/home', ensureLoggedIn, function(req, res){
	res.render('home', { user: req.user });
});

router.get("/register", (req, res) => {
   res.render("register", {
   	errorMessages: [],
   	errorFields: []
   });
});

router.get('/', (req, res) => {
	res.redirect(req.isAuthenticated ? "/home" : "/login")
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/login');
});

router.post("/register", accountsController.postRegister);
router.post('/login', passport.authenticate('local', { successRedirect: '/home', failureRedirect: '/login', failureFlash: "Invalid username/password."}));

module.exports = router;