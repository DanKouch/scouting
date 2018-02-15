const request = require('request');
const winston = require("winston")
const config = require("../config.js");

module.exports.postRegister = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/user",
		method: "POST",
		json: {},
		qs: {
			username: req.body.username,
			password: req.body.password,
			role: req.body.role
		}
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (register - post): " + err);
		}
		if(body.success){
			winston.verbose("New user '" + req.body.username + "' has registered.");
		}
		res.render("register", {
			user: req.user,
			teamName: config.teamName,
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postPitScoutingReport = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/pit-scouting-report",
		method: "POST",
		json: {},
		qs: req.body
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (pit-scouting-report - post): " + err);
		}
		if(body.success){
			winston.verbose("Pit scouting report on team " + body + req.body.teamNumber + " submitted.");
		}
		res.render("pitScoutingReport", {
			user: req.user,
			teamName: config.teamName,
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postMatchScoutingReport = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/match-scouting-report",
		method: "POST",
		json: {},
		qs: req.body
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (pit-scouting-report - post): " + err);
		}
		if(body.success){
			winston.verbose("Match scouting report on team " + body + req.body.teamNumber + " submitted.");
		}
		res.render("matchScoutingReport", {
			user: req.user,
			teamName: config.teamName,
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.pitScoutingReports = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/pit-scouting-reports",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (users - get): " + err);
		}
		res.render("pitScoutingReports", {
			user: req.user,
			teamName: config.teamName,
			reports: body
		})
	})
}

module.exports.matchScoutingReports = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/match-scouting-reports",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (users - get): " + err);
		}
		res.render("matchScoutingReports", {
			user: req.user,
			teamName: config.teamName,
			reports: body
		})
	})
}

module.exports.getWebData = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/pit-scouting-reports",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, pitScoutingReports) => {
		if(err){
			winston.error("API Request Error (webData - get): " + err);
		}
		const requestOptions = {
			url: config.apiURL + "/api/match-scouting-reports",
			method: "GET",
			json: {},
			qs: {}
		}
		request(requestOptions, (err, response, matchScoutingReports) => {
			if(err){
				winston.error("API Request Error (webData - get): " + err);
			}
			res.render("webData", {
				pitScoutingReports: pitScoutingReports,
				matchScoutingReports: matchScoutingReports
			})
		})
	})
}

// User administration routes

module.exports.users = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/users",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (users - get): " + err);
		}
		res.render("userAdministration", {
			user: req.user,
			teamName: config.teamName,
			users: body
		})
	})
}

module.exports.deleteUser = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/user",
		method: "DELETE",
		json: {},
		qs: req.query
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (user - delete): " + err);
		}
		res.json({success: body.success})
	})
}

module.exports.changeUserPassword = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/user/password",
		method: "PUT",
		json: {},
		qs: req.query
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (user password - put): " + err);
		}
		res.json({success: body.success})
	})
}