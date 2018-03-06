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
	submittedAt: 							{type: Date, default: Date.now},
	submittedBy: 							{type: String},

	// Team Information
	team:									{type: String, required: true},
	tournament: 		 					{type: String, required: true},

	matchNumber: 							{type: Number, required: true},

	// Autonomous
	crossedLineInAutonomous: 		 		{type: String},
	cubesDeliveredToSwitchInAutonomous: 	{type: Number},
	cubesDeliveredToScaleInAutonomous: 		{type: Number},
	autonomousComments: 		 			{type: String},

	// Tele-op
	cubesDeliveredToSwitchInTeleop:			{type: Number},
	cubesDeliveredToScaleInTeleop: 			{type: Number},
	cubesDeliveredToExchangeInTeleop: 		{type: Number},

	switchReliabilityInTeleop:				{type: Number},
	scaleReliabilityInTeleop:				{type: Number},
	exchangeReliabilityInTeleop:			{type: Number},
	
	climbTimeInTeleop:						{type: String},

	defenceRatingInTeleop:					{type: Number},
	drivingRatingInTeleop:					{type: Number},
	evasionRatingInTeleop:					{type: Number},
	speedRatingInTeleop:					{type: Number},

	endgame:								{type: String},
	didRobotDie:							{type: Boolean},

	teleopComments: 		 				{type: String}

});

matchScoutingReportSchema.plugin(sanitizer)
matchScoutingReportSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("MatchScoutingReport", matchScoutingReportSchema);