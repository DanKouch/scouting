'use strict';

// Modules to setup
const express = require('express');
const path = require('path');

const accountController = require("./accountsController");
const reportController = require("./reportController");

var router = express.Router();

// Users
router.post("/api/user", accountController.registerUser);
router.put("/api/user/password", accountController.changePassword);
router.delete("/api/user", accountController.deleteUser);
router.get("/api/users", accountController.findAllUsers);
router.get("/api/user/:username", accountController.findUserByUsername);

// Reports
router.post("/api/pit-scouting-report", reportController.addPitScoutingReport);
router.get("/api/pit-scouting-reports", reportController.findAllPitScoutingReports);

router.post("/api/match-scouting-report", reportController.addMatchScoutingReport);
router.get("/api/match-scouting-reports", reportController.findAllMatchScoutingReports);

module.exports = router;