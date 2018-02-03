'use strict';

// Modules to setup
const express = require('express');
const path = require('path');

const accountController = require("./accountsController");
var router = express.Router();

// Users
router.post("/api/user", accountController.registerUser);
router.put("/api/user/password", accountController.changePassword);
router.delete("/api/user", accountController.deleteUser);
router.get("/api/users", accountController.findAllUsers);

router.get("/api/user/:username", accountController.findUserByUsername);

module.exports = router;