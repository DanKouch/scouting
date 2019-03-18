const mongoose = require("mongoose");
const userModel = mongoose.model("User");
const bcrypt = require("bcrypt");
const winston = require("winston")

module.exports = (email, password, done) => {
	userModel.findOne({ email: email }, function (err, user) {
		if (err) {
			return done(err); 
		}
		if (!user) {
			return done(null, false);
		}
		bcrypt.compare(password, user.password, (bcryptError, result) => {
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