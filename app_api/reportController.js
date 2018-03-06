const accountControllers = require("./accountsController");
const common = require("./apiControllersCommon");

const mongoose = require('mongoose');
const winston = require('winston');
const bcrypt = require("bcrypt")
const util = require("util");
const passport = require("passport");

const pitScoutingReportModel = mongoose.model("PitScoutingReport");
const matchScoutingReportModel = mongoose.model("MatchScoutingReport");


module.exports.addPitScoutingReport = (req, res) => {
	if(req.query.team){
		pitScoutingReportModel.create(req.query, (err, report) => {
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
					report: report
				});
			}
		});

	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.addMatchScoutingReport = (req, res) => {
	if(req.query.team && req.query.tournament){
		matchScoutingReportModel.create(req.query, (err, report) => {
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
					report: report
				});
			}
		});

	}else{
		sendInvalidParametersError(res);
		return;
	}
}

module.exports.findAllPitScoutingReports = (req, res) => {
	pitScoutingReportModel.find({}, (err, reports) => {
		if(err){
			sendDatabaseError(res, err);
			return;
		}
		common.jsonResponse(res, common.statusCodes.OK, reports);
	})
}

module.exports.findAllMatchScoutingReports = (req, res) => {
	matchScoutingReportModel.find({}, (err, reports) => {
		if(err){
			sendDatabaseError(res, err);
			return;
		}
		common.jsonResponse(res, common.statusCodes.OK, reports);
	})
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