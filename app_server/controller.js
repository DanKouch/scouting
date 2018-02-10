const request = require('request');
const winston = require("winston")

const apiOptions = {
	server : "http://localhost:" + (process.env.API_PORT || 3005)
};

if (process.env.NODE_ENV === 'production') {
	// Set server to production thing
} 

module.exports.postRegister = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/user",
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
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postPitScoutingReport = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/pit-scouting-report",
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
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postMatchScoutingReport = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/match-scouting-report",
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
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.users = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/users",
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
			users: body
		})
	})
}

module.exports.pitScoutingReports = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/pit-scouting-reports",
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
			reports: body
		})
	})
}

module.exports.matchScoutingReports = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/match-scouting-reports",
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
			reports: body
		})
	})
}

module.exports.getWebData = (req, res) => {
	const requestOptions = {
		url: apiOptions.server + "/api/pit-scouting-reports",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, pitScoutingReports) => {
		if(err){
			winston.error("API Request Error (webData - get): " + err);
		}
		const requestOptions = {
			url: apiOptions.server + "/api/match-scouting-reports",
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