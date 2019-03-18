const express = require('express');
const winston = require("winston");
const controller = require("./controller.js");
const passport = require("passport")

let router = express.Router();

router.get('/', (req, res) => controller.render(req, res, 'home'))
router.get('/login', (req, res) => controller.render(req, res, 'login'))
router.get('/register', (req, res) => controller.render(req, res, 'register'))
router.post('/register', controller.postUser)
router.post('/login', passport.authenticate("local", { failureRedirect: '/login', successRedirect: '/'} ));
router.get('/logout', controller.getLogout)
router.get('/scout/:reportName', controller.getScout)
router.post('/scout/:reportName', controller.postScout)

module.exports = router