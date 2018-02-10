# Scouting for FRC Team 1458 Red Tie Robotics

A web server used to communicate with a Mongo database to collect information for and during FRC competitions.

## Configuration
	- All secret configuration can be found in `/secret.js`
	- The local Mongo database URI can be modified in `/database.js`
	- Port numbers for the API and App server can be modified in `/config.js`

## secret.js
For security reasons, `/secret.js` is not included in this git repository. The following is a template which can be used to create your own:

```javascript
module.exports = {
    passportSessionSecret: "SESSION_SECRET",
    rootPassword: "ROOT_PASSWORD",
    webDataPath: "WEB_DATA_PATH"
};
```

*Note: When starting a server for the first time, any values can be entered into these fields. However, the session secret should not be changed after this point, unless you delete all sessions from the database.*

## Enviroment Configuration Variables
	- NODE_ENV - "production" for MONGODB_URI connection
	- MONGODB_URI - Production URI - Overrides "localhost"
	- PORT - Overrides config.js
	- API_PORT - Overrides config.js
	- PASSPORT_SESSION_SECRET - Overriden by secret.js
	- ROOT_PASSWORD - Overriden by secret.js
	- WEB_DATA_PATH - Overriden by secret.js