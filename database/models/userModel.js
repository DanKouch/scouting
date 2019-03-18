const winston = require('winston');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

// Sanitation and Validation
const mongooseUniqueValidator = require("mongoose-unique-validator")
const sanitizer = require("mongo-sanitize")

let userSchema = new Schema({
    password: 				{type: String, required: true},
    email:                  {type: String, required: true, unique: true},
	name: 				    {type: String, required: true, unique: true, minlength: 3},
	role: 					{type: String, enum: ["administrator", "user"], default: "user"},
});

userSchema.plugin(sanitizer)
userSchema.plugin(mongooseUniqueValidator, {message: "That {PATH} has already been taken."})

var userModel = mongoose.model("User", userSchema);


// Reset root user
userModel.findOne({'name': "root"}, "name").exec((err, user) => {
	if(err){
		winston.error("Could not query for root: " + err);
	}
	if(!user){
		winston.warn("Root user not found. Creating now.")
		bcrypt.hash(process.env.ROOT_PASSWORD, 512, (bcryptError, hashedPassword) => {
			if(bcryptError){
				winston.error("Bcrypt Error Setting Root Password: " + bcryptError);
			}
			userModel.create({
                name: "root",
                email: process.env.ROOT_EMAIL,
				password: hashedPassword,
				role: "administrator"
			}, (err, user) => {
				if(err){
					winston.error("Error creating root: " + err);
				}
			});
		});
		
	}else{
		bcrypt.hash(process.env.ROOT_PASSWORD, 512, (bcryptError, hashedPassword) => {
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

