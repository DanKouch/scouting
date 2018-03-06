'use strict'

const winston = require('winston');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const validate = require("mongoose-validate")
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let pitScoutingReportSchema = new Schema({

	// Submission Info
	submittedAt: 			{type : Date, default: Date.now},
	submittedBy: 			{type : String},

	// Team Information
	team: 					{type: String, required: true},
	tournament: 			{type: String, required: true},

	// Basic Robot Information
	robotSpeed: 			{type: String},
	transmission: 			{type: String},
	driveTrain: 			{type: String},
	customDriveTrain: 		{type: String},

	// Game Elements
	canUseScaleAtTop: 		{type: Boolean},
	canUseScaleAtMid: 		{type: Boolean},
	canUseScaleAtBottom: 	{type: Boolean},
	canUseSwitch: 			{type: Boolean},
	canUseExchange: 		{type: Boolean},
	canPickOffGround: 		{type: Boolean},

	// Autonomous
	canAutonomous: 			{type: String},
	theoreticalMaxCubesInSwitchInAutonomous: {type: Number},
	theoreticalMaxCubesInScaleInAutonomous: {type: Number},
	autonomousComments: 	{type: String},
	
	// Defence
	willPlayDefence: 		{type: String},
	defenceDescription: 	{type: String},

	// Climbing
	climberType: 			{type: String},
	customClimberType: 		{type: String},
	climbTime: 				{type: Number},

	mainStrengths: 			{type: String},
	qualityOfPit: 			{type: Number},

	generalComments: 		{type: String}

});

pitScoutingReportSchema.plugin(sanitizer)
pitScoutingReportSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("PitScoutingReport", pitScoutingReportSchema);