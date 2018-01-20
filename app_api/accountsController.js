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
		userModel.findOne({'username': req.query.username}, "username accountDescription dateJoined").exec((err, user) => {
			if(!user){
				common.jsonResponse(res, common.statusCodes.DOES_NOT_EXIST, {
					message: "This document does not exist."
				});
				return;
			}
			if(err){
				common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
					message: "Server error. Please contact the system administrator."
				});
				winston.error("Database Error: " + err);
				return;
			}
			common.jsonResponse(res, common.statusCodes.OK, user)
		})
	}else{
		common.jsonResponse(res, common.statusCodes.CLIENT_ERROR, {
			message: "Client error. Invalid request parameters."
		});
		return;
	}
}

module.exports.registerUser = (req, res) => {
	if(req.query.username && req.query.password){
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
				password: hashedPassword
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
						common.jsonResponse(res, common.statusCodes.SERVER_ERROR, {
							success: false,
							err: {
								database: "A database error has occoured."
							}
						})
						winston.error("Database Error: " + err);
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
		common.jsonResponse(res, common.statusCodes.CLIENT_ERROR, {
			success: false,
			err: "Invalid request parameters."
		});
		return;
	}
}