'use strict'

const winston = require('winston');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const validate = require("mongoose-validate")
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let matchScoutingReportSchema = new Schema({

	// Submission Info
	submittedAt: 			{type : Date, default: Date.now},

	// Team Information
	teamNumber: 		 					{type: Number, required: true},
	teamName: 		 						{type: String, required: true},
	competition: 		 					{type: String, required: true},

	// Autonomous
	crossedLineInAutonomous: 		 		{type: String},
	cubesPlacedInAutonomous: 		 		{type: String},
	cubesDeliveredToSwitchInAutonomous: 	{type: Number},
	cubesDeliveredToPortalInAutonomous: 	{type: String},
	autonomousComments: 		 			{type: String},

	// Teleop
	cubesPlacedInTeleop: 		 			{type: String},
	powerupInTeleop: 		 				{type: String},
	exchangeInTeleop: 		 				{type: String},
	doesScaleTipInTeleop: 		 			{type: String},
	usedLevitateInTeleop: 		 			{type: String},
	climbedRopeInTeleop: 		 			{type: String},
	exchangeInTeleop: 		 				{type: String},
	attemptedDefenceInTeleop: 		 		{type: String},
	cubesDeliveredToSwitchInTeleop: 		{type: Number},
	cubesDeliveredToPortalInTeleop: 		{type: Number},
	teleopComments: 		 				{type: String},

	// Comments
	suggestionsForTeam: 		 			{type: String},
	newStrategies: 		 					{type: String},
	generalComments: 		 				{type: String}

});

matchScoutingReportSchema.plugin(sanitizer)
matchScoutingReportSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("MatchScoutingReport", matchScoutingReportSchema);