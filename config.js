module.exports = {
    appPort: process.env.PORT || 3001,
    apiPort: process.env.API_PORT || 3005,
    teamName: process.env.TEAM_NAME || "",
    localDatabaseURI: "mongodb://localhost/scouting",

    // Do not edit anything beyond this point unless you know what you are doing
    secret: {
	    passportSessionSecret: process.env.PASSPORT_SESSION_SECRET,
	    rootPassword: process.env.ROOT_PASSWORD,
	    webDataPath: process.env.WEB_DATA_PATH
	}
};

module.exports.apiURL = process.env.API_URL || "http://localhost:" + module.exports.apiPort;
module.exports.databaseURI = process.env.NODE_ENV === "production" ? process.env.MONGOLAB_URI : module.exports.localDatabaseURI;