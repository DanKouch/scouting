const express = require('express');
const winston = require("winston");
const controller = require("./controller.js");
const passport = require("passport")
const commonMiddlewear = require("../database/commonMiddlewear.js")


let router = express.Router();

router.get('/', commonMiddlewear.injectAllReports, (req, res) => controller.render(req, res, 'home', {reports:req.reports}))
router.get('/login', (req, res) => controller.render(req, res, 'login'))
router.get('/register', controller.ensureAdministrator, (req, res) => controller.render(req, res, 'register'))
router.post('/register', controller.ensureAdministrator, controller.postUser)
router.post('/login', passport.authenticate("local", { failureRedirect: '/login', successRedirect: '/'} ));
router.get('/data', commonMiddlewear.injectAllReports, (req, res) => controller.render(req, res, 'data', {reports:req.reports}))
router.get('/data/:reportName.csv', commonMiddlewear.injectAllReports, controller.getDataCSV)
router.get('/logout', controller.getLogout)
router.get('/scout/:reportName', controller.getScout)
router.post('/scout/:reportName', controller.postScout)

module.exports = router