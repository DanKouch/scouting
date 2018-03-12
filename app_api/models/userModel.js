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
	username: 				{type: String, required: true, unique: true, minlength: 4, maxlength:20, validate: [validate.alphanumeric, 'alphanumeric']},
	role: 					{type: String, enum: ["administrator", "user"], default: "user"},
	messages: 				[String]
});

userSchema.plugin(sanitizer)
userSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

var userModel = mongoose.model("User", userSchema);


// Reset root user

var common = require("../apiControllersCommon.js");
const config = require("../../config.js");

userModel.findOne({'username': "root"}, "username").exec((err, user) => {
	if(err){
		winston.error("Could not query for root: " + err);
	}
	if(!user){
		winston.warn("Root user not found. Creating now.")
		common.hashPassword(config.secret.rootPassword, (bcryptError, hashedPassword) => {
			if(bcryptError){
				winston.error("Bcrypt Error Setting Root Password: " + bcryptError);
			}
			userModel.create({
				username: "root",
				password: hashedPassword,
				role: "administrator"
			}, (err, user) => {
				if(err){
					winston.error("Error creating root: " + err);
				}
			});
		});
		
	}else{
		common.hashPassword(config.secret.rootPassword, (bcryptError, hashedPassword) => {
			if(bcryptError){
				winston.error("Bcrypt Error Setting Root Password: " + bcryptError);
				return;
			}
			user.password = hashedPassword;
			user.role = "administrator";
			user.save();
		});
		winston.info("Root user reset")	
	}
})


