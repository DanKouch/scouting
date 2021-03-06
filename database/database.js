const mongoose = require('mongoose')
const winston = require('winston')
const config = require('config')

module.exports = () => {
    mongoose.connect(config.get("Database.URI"), {useNewUrlParser: true}).then(
        () => {
            winston.info("Connected to MongoDB server at '" + config.get("Database.URI") + "'");
            // Run Statistics
            require("../statistics.js").updateStatisticsData(() => {})
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

    // Fix deprecation warnings
    mongoose.set('useCreateIndex', true);
    mongoose.set('useFindAndModify', false)

    require("./models/userModel.js");
    require("./models/reportModel.js");
}