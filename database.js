'use strict';

// Require modules
const mongoose = require('mongoose')
const winston = require('winston')
const config = require("./config.js")

mongoose.connect(config.databaseURI, {useMongoClient: true}).then(
	() => {
		winston.info("Connected to mongodb server at '" + dbURI + "'");
	},
	err => {
		winston.error("Database Error: " + err)
	}
);

mongoose.connection.on("error", (err) => {
	winston.error("Database Error: " + err)
});

mongoose.connection.on("disconnected", () => {
	winston.warn("Disconnected from mongoose database.");	
});

// Load models
require("./app_api/models/userModel.js");
require("./app_api/models/messageModel.js");
require("./app_api/models/pitScoutingReportModel.js");
require("./app_api/models/matchScoutingReportModel.js");