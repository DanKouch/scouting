const request = require('request');
const winston = require("winston")

const apiOptions = {
	server : "http://localhost:" + (process.env.PORT || 3001)
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
			password: req.body.password
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
			errorMessages: body.err
		})
	})
}