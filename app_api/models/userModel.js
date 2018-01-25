'use strict'

const winston = require('winston');

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const validate = require("mongoose-validate")
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let userSchema = new Schema({
	password: 				{type: String, required: true, minlength: 6},
	username: 				{type: String, required: true, unique: true, minlength: 5, maxlength:20, validate: [validate.alphanumeric, 'username must be alphanumeric']},
	role: 					{type: String, enum: ["administrator", "user"], default: "user"}
});

userSchema.plugin(sanitizer)
userSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

mongoose.model("User", userSchema);