const accountControllers = require("./accountsController");
const common = require("./apiControllersCommon");

const mongoose = require('mongoose');
const winston = require('winston');
const bcrypt = require("bcrypt")
const util = require("util");
const passport = require("passport");

const userModel = mongoose.model("User");

module.exports.findUserByUsername = (req, res) => {
	if(req.querry && req.query.username){
		userModel.findOne({'username': req.query.username.toLowerCase()}, "username accountDescription dateJoined").exec((err, user) => {
			if(!user){
				common.jsonResponse(res, common.statusCodes.DOES_NOT_EXIST, {
					message: "This document does not exist."
				});
				return;
			}
			if(err){
				sendDatabaseError(res, err);
			}
			common.jsonResponse(res, common.statusCodes.OK, user)
		})
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.findAllUsers = (req, res) => {
	userModel.find({}, (err, users) => {
		if(err){
			sendDatabaseError(res, err);
			return;
		}
		var refinedUsers = users.map((user) => {
			return {
				username: user.username,
				role: user.role,
				id: user.id
			}
		})
		common.jsonResponse(res, common.statusCodes.OK, refinedUsers);
	})
}

module.exports.registerUser = (req, res) => {
	if(req.query.username && req.query.password){
		req.query.username = req.query.username.toLowerCase();
		common.hashPassword(req.query.password, (bcryptError, hashedPassword) => {
			if(bcryptError){
				common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
					success: false,
					err: "A server error has occoured."
				})
				winston.error("Bcrypt Error: " + bcryptError);
				return;
			}
			userModel.create({
				username: req.query.username,
				password: hashedPassword,
				role:  req.query.role ? req.query.role.toLowerCase() : "user"
			}, (err, user) => {
				if(err){
					var errorObjects = Object.values(err.errors).map((err) => {
						return (common.generateValidatorErrorObject(err));
					});

					var errorObject = errorObjects.reduce((acc, cur, i) => {
						acc[cur.field] = cur.message;
						return acc
					}, {})

					if(errorObjects.length > 0){
						common.jsonResponse(res, common.statusCodes.CLIENT_ERROR, {
							success: false,
							err: errorObject
						})
					}else{
						sendDatabaseError(res, err);
						return;
					}
				}else{
					common.jsonResponse(res, common.statusCodes.OK, {
						success: true,
						user: user
					});
				}
			});
		});
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.deleteUser = (req, res) => {
	if(req.query.id){
		userModel.findByIdAndRemove(req.query.id).exec((err, user) => {
			if(err){
				sendDatabaseError(res, err);
				return;

			}
			common.jsonResponse(res, common.statusCodes.OK, {
				success: true
			});
		})
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.changePassword = (req, res) => {
	if(req.query.id && req.query.password){
		common.hashPassword(req.query.password, (bcryptError, hashedPassword) => {
			if(bcryptError){
				common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
					success: false,
					err: "A server error has occoured."
				})
				winston.error("Bcrypt Error: " + bcryptError);
				return;
			}

			winston.info(req.query.id);
			userModel.findById(mongoose.Types.ObjectId(req.query.id), (err, user) => {
				if(err){
					sendDatabaseError(res, err);
					return;
				}
				if(!user){
					common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
						success: false,
						err: "No user with that ID could be found."
					})
					return;
				}
				user.password = hashedPassword;
				user.save();
				common.jsonResponse(res, common.statusCodes.OK, {
					success: true
				});
			});
		});
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

function sendDatabaseError(res, err){
	common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
		success: false,
		err: {
			database: "A database error has occoured."
		}
	})
	winston.error("Database Error: " + err);
}

function sendInvalidParametersError(res){
	common.jsonResponse(res, common.statusCodes.CLIENT_ERROR, {
		success: false,
		err: {
			database: "Invalid request parameters."
		}
	});
}