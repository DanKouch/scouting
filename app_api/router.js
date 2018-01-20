'use strict';

// Modules to setup
const express = require('express');
const path = require('path');

const accountController = require("./accountsController");
var router = express.Router();

// Users
router.post("/api/user", accountController.registerUser);
router.get("/api/user/:username", accountController.findUserByUsername);

module.exports = router;