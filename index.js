// Import NPM Modules
const express = require("express")
const winston = require("winston")
const config = require("config")

// Create Express Server Instances
const app = express()
const api = express()

// Dot Env Configuration
require('dotenv').config()
const production = process.env.NODE_ENV == "production"

// Configure Winston logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true, 'colorize': true, 'level': "silly"})
winston.add(winston.transports.File, { filename: './logs/main.log' });

// Setup Database Connection
require("./database/database.js")();

// Setup TBA Connection
const tba = require("./tba.js");

// Load Scouting Schema Data
const reportSchemas = require("./reportSchemas")

// Run Setup Script
require("./app/app.js")(app);

// Start App Server
if(production){
    winston.info("Running in production mode.")
    https.createServer({
            key: fs.readFileSync("./ssl/private_key.key"),
            ca: fs.readFileSync("./ssl/ca.ca-bundle"),
            cert: fs.readFileSync("./ssl/certificate.crt")
        }, app).listen(config.get("App.secure_port") || 443 , () => {
            winston.info("App HTTPS server started on port " + config.get("App.secure_port") || 443);
        });
}
  
app.listen(config.get("App.port"), () => {
    winston.info("App HTTP server started on port " + config.get("App.port"));
});