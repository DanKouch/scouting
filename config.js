const optionalRequire = require("optional-require")(require);
const secretFile = optionalRequire("./secret.js");

module.exports = {
    appPort: process.env.PORT || 3001,
    apiPort: process.env.API_PORT || 3005,
    localDatabaseURI: "mongodb://localhost/scouting",

    // Do not edit anything beyond this point unless you know what you are doing
    secret: {
	    passportSessionSecret: secretFile.passportSessionSecret || process.env.PASSPORT_SESSION_SECRET,
	    rootPassword: secretFile.rootPassword || process.env.ROOT_PASSWORD,
	    webDataPath: secretFile.webDataPath || process.env.WEB_DATA_PATH
	}
};

module.exports.apiURL = process.env.API_URL || "http://localhost:" + module.exports.apiPort;
module.exports.databaseURI = process.env.NODE_ENV === "production" ? process.env.MONGOLAB_URI : module.exports.localDatabaseURI;