// Import NPM Modules
const express = require("express")
const winston = require("winston")
const https = require("https")
const fs = require("fs")

// Create Express Server Instances
const app = express()
const api = express()

// Dot Env Configuration
require('dotenv').config()
const production = process.env.NODE_ENV == "production"

// Config
const config = require("config")

// Configure Winston logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true, 'colorize': true, 'level': "silly"})
winston.add(winston.transports.File, { filename: './logs/main.log' });

// Setup TBA Connection
const tba = require("./tba.js");
tba.getData((data) => {

    // Setup Database Connection
    require("./database/database.js")();

    // Load Scouting Schema Data
    const reportSchemas = require("./reportSchemas")

    // Run Setup Script
    require("./app/app.js")(app);

    // Start App Server
    winston.info("Running server in " + (production ? "PRODUCTION" : "DEVELOPMENT") + " mode")

    if(production){
        try{
            https.createServer({
                key: fs.readFileSync("./ssl/private_key.key"),
                ca: fs.readFileSync("./ssl/ca.ca-bundle"),
                cert: fs.readFileSync("./ssl/certificate.crt")
            }, app).listen(config.has('App.secure_port') ? config.get("App.secure_port") : 443, () => {
                winston.info("App HTTPS server started on port " + (config.has('App.secure_port') ? config.get("App.secure_port") : 443));
            });
            
            // Redirect users to HTTPS site if they try to visit HTTP site
            app.use(require('force-https'))
        } catch (error) {
            if(error.code == "ENOENT")
                winston.warn("Unable to start HTTPS server due to missing certificate files.")
            else
                throw error;
        }
        
    }
    
    app.listen(config.get("App.port"), () => {
        winston.info("App HTTP server started on port " + config.get("App.port"));
    });
});