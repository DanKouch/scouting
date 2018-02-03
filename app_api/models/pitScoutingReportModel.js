'use strict'

const winston = require('winston');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const validate = require("mongoose-validate")
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let pitScoutingReportSchema = new Schema({
	// Team Information
	teamNumber: 			{type: Number, required: true},
	teamName: 				{type: String, required: true},

	// Basic Robot Information
	robotSpeed: 			{type: String},
	transmission: 			{type: String},
	wheelsCount:			{type: Number},
	driveType:				{type: String},
	customDriveType: 		{type: String},

	// Game Elements
	switches: 				{type: String},
	usingScale: 			{type: String},
	usingPortal: 			{type: String},

	// Autonomous
	canAutonomous: 			{type: String},
	autonomousComments: 	{type: String},

	// Defence
	willPlayDefence: 		{type: String},
	defenceDescription: 	{type: String},

	// Rope Climbing
	canClimbRope: 			{type: String},
	ropeAttatchTime: 		{type: Number},
	ropeClimbTime:			{type: Number},

	// Other Tournaments
	goingToSFRegional: 		{type: String},
	goingToSacRegional: 	{type: String},

	otherComments: 			{type: String}

});

pitScoutingReportSchema.plugin(sanitizer)
pitScoutingReportSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("PitScoutingReport", pitScoutingReportSchema);