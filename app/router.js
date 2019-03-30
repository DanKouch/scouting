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
router.get('/scout/:reportName', commonMiddlewear.injectAllReports, controller.getScout)
router.post('/scout/:reportName', controller.postScout)

router.get('/users', controller.ensureAdministrator, commonMiddlewear.injectAllUsers, (req, res) => controller.render(req, res, 'users', {users:req.users}))
router.post('/users/changePassword', controller.ensureAdministrator, controller.changeUserPassword)
router.post('/users/delete', controller.ensureAdministrator, controller.deleteUser)

module.exports = router