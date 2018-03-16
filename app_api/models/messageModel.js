'use strict'

const winston = require('winston');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const validate = require("mongoose-validate")
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let messageSchema = new Schema({
	sentAt: 								{type: Date, default: Date.now},
	sender: 								{type: String},
	sentByAdministrator: 					{type: Boolean, default: false},

	recipient: 								{type: String},

	level: 									{type: String, enum: ["info", "warning", "danger"], default: "info"},
	message: 		 						{type: String}

});

messageSchema.plugin(sanitizer)
messageSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("Message", messageSchema);