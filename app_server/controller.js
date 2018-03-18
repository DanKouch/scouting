const request = require('request');
const winston = require("winston")
const config = require("../config.js");
const json2csv = require('json2csv').parse;

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
		module.exports.renderPage(req, res, "register", {
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postPitScoutingReport = (req, res) => {
	// Remove unknown and blanks
	var query = {};
	query.submittedBy = req.user.username;
	for(var property in req.body){
		if(req.body[property].trim() == "" || req.body[property].toUpperCase() == "UNKNOWN" || req.body[property] == -1){
			//winston.info("skipped " + property);
			continue;
		}
		query[property] = req.body[property];
	}

	const requestOptions = {
		url: config.apiURL + "/api/pit-scouting-report",
		method: "POST",
		json: {},
		qs: query
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (pit-scouting-report - post): " + err);
		}
		if(body.success){
			winston.verbose("Pit scouting report on team '" + req.body.team + "' submitted.");
		}
		module.exports.renderPage(req, res, "pitScoutingReport", {
			success: body.success,
			errorMessages: body.err
		})
	})
}

module.exports.postMatchScoutingReport = (req, res) => {
	// Remove unknown and blanks
	var query = {};
	query.submittedBy = req.user.username;
	for(var property in req.body){
		if(req.body[property].trim() == "" || req.body[property].toUpperCase() == "UNKNOWN" || req.body[property] == -1){
			continue;
		}
		query[property] = req.body[property];
	}

	const requestOptions = {
		url: config.apiURL + "/api/match-scouting-report",
		method: "POST",
		json: {},
		qs: query
	}
	request(requestOptions, (err, response, body) => {
		if(err){
			winston.error("API Request Error (pit-scouting-report - post): " + err);
		}
		if(body.success){
			winston.verbose("Match scouting report on team '" + req.body.team + "' submitted.");
		}
		module.exports.renderPage(req, res, "matchScoutingReport", {
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
		module.exports.renderPage(req, res, "pitScoutingReports", {
			reports: body
		})
	})
}

module.exports.pitScoutingReportsCsv = (req, res) => {
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
        winston.info(json2csv(body), {fields: Object.keys(body)})
    })
}

module.exports.matchScoutingReportsCsv = (req, res) => {
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
        winston.info(json2csv(body), {fields: Object.keys(body)})
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
		module.exports.renderPage(req, res, "matchScoutingReports", {
			reports: body
		})
	})
}

module.exports.deleteMatchScoutingReport = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/match-scouting-report",
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

module.exports.deletePitScoutingReport = (req, res) => {
	const requestOptions = {
		url: config.apiURL + "/api/pit-scouting-report",
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
				showPitScouting: (!req.query.showpitscouting || req.query.showpitscouting == "true"),
				showMatchScouting: (!req.query.showmatchscouting || req.query.showmatchscouting == "true"),
				pitScoutingReports: pitScoutingReports,
				matchScoutingReports: matchScoutingReports
			})
		})
	})
}

Array.prototype.average = function () { var sum = 0, j = 0; for (var i = 0; i < this.length, isFinite(this[i]); i++) { sum += parseFloat(this[i]); ++j; } return j ? Math.round(10*(sum / j))/10 : 0; }

Array.prototype.byCount= function(){
    var itm, a= [], L= this.length, o= {};
    for(var i= 0; i<L; i++){
        itm= this[i];
        if(!itm) continue;
        if(o[itm]== undefined) o[itm]= 1;
        else ++o[itm];
    }
    for(var p in o) a[a.length]= p;
    return a.sort(function(a, b){
        return o[b]-o[a];
    });
}

Array.prototype.listOnLines= function(){
    var output = "";
    for(var i = 0; i < this.length; i++){
    	output += (this[i] != "" && this[i] != null && this[i] != undefined) ? (this[i] + ((i != this.length - 1) ? ", " : ".")) : "";
    }
    var outputLength = output.length
    return "[" + output.substring(0, outputLength-2) + "]";
}

module.exports.getWebDataConsolidated = (req, res) => {
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

			// Data consolidation
			var matchScoutingData = [];
			for(var i = 0; i < config.teams.length; i++){
				var teamData = {};

				var teamMatchScoutingReports = matchScoutingReports.filter(t => t.team == config.teams[i]);

				teamData.teamName = config.teams[i];

				teamData.numberOfReports = teamMatchScoutingReports.length;

				// Actual consolidation here
				teamData.crossedLineInAutonomousFrequency = teamMatchScoutingReports.map(t => t.crossedLineInAutonomous).map(t => t == "Yes" ? 1 : 0).average();
				
				teamData.averageCubesDeliveredToSwitchInAutonomous = teamMatchScoutingReports.map(t => t.cubesDeliveredToSwitchInAutonomous).average();
				teamData.zeroedAverageCubesDeliveredToSwitchInAutonomous = teamMatchScoutingReports.map(t => t.cubesDeliveredToSwitchInAutonomous).filter((a) => a != 0).average()

				teamData.averageCubesDeliveredToScaleInAutonomous = teamMatchScoutingReports.map(t => t.cubesDeliveredToScaleInAutonomous).average();
				teamData.zeroedAverageCubesDeliveredToScaleInAutonomous = teamMatchScoutingReports.map(t => t.cubesDeliveredToScaleInAutonomous).filter((a) => a != 0).average();

				teamData.autonomousComments = teamMatchScoutingReports.map(t => t.autonomousComments).listOnLines();

				teamData.averageCubesDeliveredToSwitchInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToSwitchInTeleop).average();
				teamData.zeroedAverageCubesDeliveredToSwitchInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToSwitchInTeleop).filter((a) => a != 0).average();

				teamData.averageCubesDeliveredToScaleInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToScaleInTeleop).average();
				teamData.zeroedAverageCubesDeliveredToScaleInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToScaleInTeleop).filter((a) => a != 0).average();

				teamData.averageCubesDeliveredToExchangeInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToExchangeInTeleop).average();
				teamData.zeroedAverageCubesDeliveredToExchangeInTeleop = teamMatchScoutingReports.map(t => t.cubesDeliveredToExchangeInTeleop).filter((a) => a != 0).average();

				teamData.averageSwitchReliabilityInTeleop = teamMatchScoutingReports.map(t => t.switchReliabilityInTeleop).average();
				teamData.averageScaleReliabilityInTeleop = teamMatchScoutingReports.map(t => t.scaleReliabilityInTeleop).average();
				teamData.averageExchangeReliabilityInTeleop = teamMatchScoutingReports.map(t => t.exchangeReliabilityInTeleop).average();

				teamData.averageClimbTimeInTeleop = teamMatchScoutingReports.map(t => t.climbTimeInTeleop).average();
				teamData.zeroedAverageClimbTimeInTeleop = teamMatchScoutingReports.map(t => t.climbTimeInTeleop).filter((a) => a != 0).average();
				
				teamData.averageDefenceRatingInTeleop = teamMatchScoutingReports.map(t => t.defenceRatingInTeleop).average();
				teamData.averageDrivingRatingInTeleop = teamMatchScoutingReports.map(t => t.drivingRatingInTeleop).average();
				teamData.averageEvasionRatingInTeleop = teamMatchScoutingReports.map(t => t.evasionRatingInTeleop).average();
				teamData.averageSpeedRatingInTeleop = teamMatchScoutingReports.map(t => t.speedRatingInTeleop).average();

				teamData.endgamesSortedByFrequency = teamMatchScoutingReports.map(t => t.endgame).byCount();

				teamData.frequencyOfRobotDeath = teamMatchScoutingReports.map(t => t.didRobotDie).average();

				teamData.teleopComments = teamMatchScoutingReports.map(t => t.teleopComments).listOnLines();


				matchScoutingData.push(teamData);
			}

			res.render("webDataConsolidated", {
				showPitScouting: false,
				showMatchScouting: true,
				pitScoutingReports: pitScoutingReports,
				matchScoutingData: matchScoutingData,
				teams: config.teams
			})
		})
	})
}

module.exports.messages = (req, res) => {
	// User list
	const requestOptions = {
		url: config.apiURL + "/api/users",
		method: "GET",
		json: {},
		qs: {}
	}
	request(requestOptions, (err, response, users) => {
		if(err){
			winston.error("API Request Error (messages - get): " + err);
		}
		// User message list
		const requestOptions = {
			url: config.apiURL + "/api/message/user",
			method: "GET",
			json: {},
			qs: {username: req.user.username}
		}
		request(requestOptions, (err, response, messages) => {
			if(err){
				winston.error("API Request Error (messages - get): " + err);
			}
			// Admin message list
			const requestOptions = {
				url: config.apiURL + "/api/message/administrators",
				method: "GET",
				json: {},
				qs: {}
			}
			request(requestOptions, (err, response, administratorMessages) => {
				if(err){
					winston.error("API Request Error (messages - get): " + err);
				}

				// Update message status
				const requestOptions = {
					url: config.apiURL + "/api/message/user/status/update",
					method: "POST",
					json: {},
					qs: {username: req.user.username}
				}
				request(requestOptions, (status) => {
					if(!status){
						winston.error("Could not update message status.")
					}
					module.exports.renderPage(req, res, "messages", {
						users: users.map((user) => user.username).sort(),
						messages: messages,
						administratorMessages: administratorMessages
					})
				});

				
			})
		})
	})
}

module.exports.postMessage = (req, res) => {
	winston.info(req.body);
	const requestOptions = {
		url: config.apiURL + "/api/message/send",
		method: "POST",
		json: {},
		qs: {
			sender: req.user.username,
			recipient: req.user.role == "administrator" ? req.body.recipient : "Administrators",
			sentByAdministrator: req.user.role == "administrator",
			level: req.body.level || "info",
			message: req.body.message
		}
	}
	request(requestOptions, (err, response, messages) => {
		if(err){
			winston.error("API Request Error (messages - get): " + err);
		}
		res.redirect("/messages")
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
		module.exports.renderPage(req, res, "userAdministration", {
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

module.exports.renderPage = (req, res, page, vars) => {
	const requestOptions = {
		url: config.apiURL + "/api/message/user/status",
		method: "GET",
		json: {},
		qs: {username: req.user.username}
	}
	request(requestOptions, (err, response, messageStatus) => {
		if(err){
			winston.error("API Request Error (message status - get): " + err);
		}
		vars.user = req.user;
		vars.user.hasNewMessages = messageStatus;
		vars.teamName = config.teamName;
		vars.teams = config.teams;
		vars.tournament = config.tournament;
		res.render(page, vars)
	})
}