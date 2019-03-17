const express = require('express');
const winston = require("winston");
const controller = require("./controller.js");

let router = express.Router();

router.get('/home', (req, res) => controller.render(req, res, 'home'))
router.get('/', (req, res) => controller.render(req, res, 'login'))
router.get('/scout/:reportName', controller.getScout)

module.exports = router