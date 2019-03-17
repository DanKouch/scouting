const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

module.exports = () => {
    mongoose.connect(config.get("Database.URI"), {useNewUrlParser: true}).then(
        () => {
            winston.info("Connected to MongoDB server at '" + config.get("Database.URI") + "'");
        },
        err => {
            winston.error("Mongoose Connection Error: " + err)
        }
    );
    
    mongoose.connection.on("error", (err) => {
        winston.error("Database Error: " + err)
    });
    
    mongoose.connection.on("disconnected", () => {
        winston.warn("Disconnected from mongoose database.");	
    });
}