# Scouting for FRC Team 1458 Red Tie Robotics

A web server used to communicate with a Mongo database to collect information for and during FRC competitions.

## Enviroment Configuration Variables
	- NODE_ENV - "production" or "debug"
	- MONGODB_URI
	- MONGOLAB_URI - Secondary URI
	- PORT - App http port
	- API_PORT - Api http port
	- PASSPORT_SESSION_SECRET
	- ROOT_PASSWORD
	- WEB_DATA_PATH
	- TEAM_NAME
	- TOURNAMENT - Name of current tournament
	- TEAMS - List of teams attending current tournament separated by ', '

*Note: This project does support `.env` file integration.*
