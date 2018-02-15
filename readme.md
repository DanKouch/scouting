# Scouting for FRC Team 1458 Red Tie Robotics

A web server used to communicate with a Mongo database to collect information for and during FRC competitions.

## Configuration
	- All secret configuration can be found in `/secret.js`
	- The local Mongo database URI can be modified in `/database.js`
	- Port numbers for the API and App server can be modified in `/config.js`

*Note: When starting a server for the first time, any values can be entered into these fields. However, the session secret should not be changed after this point, unless you delete all sessions from the database.*

## Enviroment Configuration Variables
	- NODE_ENV - "production" or "debug"
	- MONGODB_URI - Production URI - Overrides "localhost"
	- PORT - App http port
	- API_PORT - Api http port
	- PASSPORT_SESSION_SECRET
	- ROOT_PASSWORD
	- WEB_DATA_PATH

*Note: This project does support `.env` file integration.*