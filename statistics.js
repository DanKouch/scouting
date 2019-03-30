const winston = require("winston")
const tba = require("tba.js")

let statistics = {}

// Injection Middlewear
module.exports.getStatisticsData = (req, res, next) => {
    module.exports.updateStatisticsData()
}

module.exports.updateStatisticsData = () => {
    
}



// Initial statistics run
module.exports.getStatisticsData();

console.log(JSON.stringify(module.exports.statistics))