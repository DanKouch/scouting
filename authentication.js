const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const bcrypt = require("bcrypt");
const appApiCommon = require("./app_api/apiControllersCommon.js");
const winston = require("winston");

module.exports.authenticate = function(username, password, done) {
	userModel.findOne({ username: username }, function (err, user) {
		if (err) {
			return done(err); 
		}
		if (!user) {
			return done(null, false);
		}
		appApiCommon.comparePassword(password, user.password, (bcryptError, result) => {
			if(bcryptError){
				return done(err);
			}
			if(result){
				return done(null, user);
			}else{
				return done(null, false);
			}
		});
	});
};