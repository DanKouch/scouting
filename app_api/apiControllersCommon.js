const bcrypt = require("bcrypt")
const winston = require("winston")

module.exports.statusCodes = {
	OK: 			200,
	DOES_NOT_EXIST: 400,
	SERVER_ERROR: 	200,
	CLIENT_ERROR: 	400
}

module.exports.jsonResponse = (res, statusCode, content) => {
	res.status(statusCode);
	res.json(content);
}

module.exports.hashPassword = (password, callback) => {
	bcrypt.hash(password, 512, callback);
}

module.exports.comparePassword = (password, hash, callback) => {
	bcrypt.compare(password, hash, callback);
}

module.exports.generateValidatorErrorObject = (error) => {
	var errorObject = {field: error.path};
	if(error.kind == "minlength"){
		errorObject.message =  "Your " + error.path + " is not long enough."
	}
	if(error.kind == "maxlength"){
		errorObject.message =  "Your " + error.path + " is too long."
	}
	if(error.kind == "unique"){
		errorObject.message = "That " + error.path + " is already in use. Please select another."
	}
	if(error.message == "alphanumeric"){
		errorObject.message = "Your " + error.path + " must be alphanumeric."
	}
	if(!errorObject.message){
		winston.error("Unrecognized api response error: " + error)
	}
	return errorObject;
}