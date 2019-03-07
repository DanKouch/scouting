// Import NPM Modules
const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const winston = require("winston")
const config = require("config")

// Create Express Server Instances
const app = express()
const api = express()

// Dot Env Configuration
require('dotenv').config()

// Configure Winston logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp': true, 'colorize': true, 'level': "silly"})
winston.add(winston.transports.File, { filename: './logs/main.log' });

// Configure body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "insecure"));

// Set Up Database Connecton

// Configure Sessions

// Configure Passport

// Set up public folders
app.use("/", express.static('./bower_components'));
app.use("/", express.static('./public'));

// Configure app
app.set("view engine", "pug");
app.set('views', './app_server/views');

// Base routing

// Start App HTTP server

// Start API HTTP server