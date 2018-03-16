const mongoose = require('mongoose');
const winston = require('winston');
const util = require("util");

const common = require("./apiControllersCommon");


const messageModel = mongoose.model("Message");
const userModel = mongoose.model("User");

module.exports.sendMessage = (req, res) => {
	if(req.query && req.query.sender && req.query.recipient && req.query.message){
		messageModel.create(req.query, (err, message) => {
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
					message: message
				});
			}
		});
	}else{
		winston.error(req.query)
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.findAllAdministratorMessages = (req, res) => {
	messageModel.find({recipient: "Administrators"}, (err, messages) => {
		if(err){
			sendDatabaseError(res, err);
			return;
		}
		common.jsonResponse(res, common.statusCodes.OK, messages);
	})
}

module.exports.findMessagesForUser = (req, res) => {
	if(req.query && req.query.username){
		messageModel.find({$or: [{recipient: req.query.username}, {recipient: "All"}]}, (err, messages) => {
			if(err){
				sendDatabaseError(res, err);
				return;
			}
			common.jsonResponse(res, common.statusCodes.OK, messages);
		});
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.doesUserHaveNewMessages = (req, res) => {
	if(req.query && req.query.username){
		userModel.findOne({username: req.query.username}, (err, user) => {
			if(err){
				sendDatabaseError(res, err);
				return;
			}
			messageModel.find({$or: [{recipient: req.query.username}, {recipient: "All"}]}, (err, messages) => {
				if(err){
					sendDatabaseError(res, err);
					return;
				}
				for(var i = 0; i < messages.length; i++){
					if(messages[i].sentAt.getTime() > user.lastMessageRead.getTime()){
						common.jsonResponse(res, common.statusCodes.OK, true);
						return;
					}
				}
				common.jsonResponse(res, common.statusCodes.OK, false);
			});
		});
		
	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.updateLastMessageRead = (req, res) => {
	if(req.query && req.query.username){
		userModel.findOne({username: req.query.username}, (err, user) => {
			if(err){
				sendDatabaseError(res, err);
				return;
			}
			if(!user){
				common.jsonResponse(res, common.statusCodes.OK, false);
			}
			user.lastMessageRead = Date.now();
			user.save();
			common.jsonResponse(res, common.statusCodes.OK, true);
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