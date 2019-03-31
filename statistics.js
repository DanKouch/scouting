const winston = require("winston")
const tba = require("./tba.js")
const mongoose = require("mongoose")
const reportSchemas = require("./reportSchemas.js")

let statistics = {}


const reportModel = mongoose.model("Report");

// Injection Middlewear
module.exports.injectStatisticsData = (req, res, next) => {
    req.statistics = statistics;
    next()
}

let average = (array) => {
    if(array.length == 0)
        return "Unknown"
    return (array.reduce((sum, val) => sum + val, 0) / array.length)
};

module.exports.updateStatisticsData = (callback) => {
    let temporaryStatistics = {
        teams: []
    };
    let matchSchema = reportSchemas.filter(a => a.name.toLowerCase().includes("match"))[0]
    let pitSchema = reportSchemas.filter(a => a.name.toLowerCase().includes("pit"))[0]
    tba.getData((data) => {
        reportModel.find({}).sort({submittedAt : -1}).exec((err, reports) => {
            if(!err){
                data.teams.forEach(team => {
                    let teamStats = {}
                    teamStats.name = team.team_number + " - " + team.nickname
                    teamStats.ranking = data.rankings.rankings.filter(a => a.team_key == team.key)[0]
                    teamStats.pitData = reports.filter(a => JSON.parse(JSON.stringify(a)).schemaName.toLowerCase().includes("pit") && a.team == team.team_number + " - " + team.nickname)[0]
                    if(teamStats.pitData){
                        teamStats.pitData = JSON.parse(JSON.stringify(teamStats.pitData))
                    }
                    teamStats.matchData = matchSchema.fields.filter(a => a.type == "number" || a.type == "stars").map(a => a.name).filter(a => a != "matchNumber").map(fieldName => { return { name: matchSchema.fields.filter(a => a.name == fieldName)[0].description, values: (reports.filter(a => a.schemaName.toLowerCase().includes("match") && a.team == team.team_number + " - " + team.nickname).map(a => JSON.parse(JSON.stringify(a))[fieldName]).filter(a => a !== "").map(a => parseInt(a)).filter(a => a >= 0))}})
                    let redMatchesAverage = (data.matches.filter(a => a.alliances.red.team_keys.includes(team.key) && a.score_breakdown).map(a => a.score_breakdown.red.rp));
                    let blueMatchesAverage = (data.matches.filter(a => a.alliances.blue.team_keys.includes(team.key) && a.score_breakdown).map(a => a.score_breakdown.blue.rp));
                    teamStats.RP = redMatchesAverage.concat(blueMatchesAverage)
                    temporaryStatistics.teams.push(teamStats)
                });
                callback(temporaryStatistics)
            }else{
                throw err;
            }
        });
    }, false);
}

function statisticsLoop(){
    module.exports.updateStatisticsData((stats) => {
        //winston.silly("Statistics updated.")
        statistics = stats;
        // Refresh stats every minute
        setTimeout(statisticsLoop, 1000*60);
    })
}
statisticsLoop();
