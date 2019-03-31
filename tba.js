const winston = require("winston")
const config = require("config")
var request = require("request");

module.exports = {
    lastRetreived: 0,
    getData: function(callback, forceUpdate) {
        // Check to see if it has been a set amount of time since the last request
        if(Date.now() - module.exports.lastRetreived > config.get("TBA.frequency") || forceUpdate){
            module.retreiveTBAData().then(() => callback(module.TBAdata))
            module.exports.lastRetreived = Date.now()
        }else{
            callback(module.TBAdata)
        }
    }
}

module.TBAdata = {};
module.exports.firstTime = true;

module.retreiveTBAData = (url) => {
    return new Promise((resolve) => {
        promises = []

        // Get these only the first time something is needed
        if(module.exports.firstTime){
            // Information on all teams at competition
            promises.push(module.sendTBARequest("/event/" + config.get("TBA.event_key") + "/teams/simple").then((data) => {
                module.TBAdata.teams = data
                module.exports.teams = module.TBAdata.teams
                module.TBAdata.team = data.filter(a => a.key == config.get("TBA.team_key"))[0]
                module.exports.team = module.TBAdata.team
            }));

            // Information about the specific event entered
            promises.push(module.sendTBARequest("/event/" + config.get("TBA.event_key") + "/simple").then((data) => {
                module.TBAdata.event = data
                module.exports.event = module.TBAdata.event
            }));
        }

        // Get these regularly
        
        // Information on rankings
        promises.push(module.sendTBARequest("/event/" + config.get("TBA.event_key") + "/rankings").then((data) => {
            module.TBAdata.rankings = data
            module.TBAdata.ranking = data.rankings.filter(a => a.team_key == config.get("TBA.team_key"))[0]
        }));

        // Information on matches
        promises.push(module.sendTBARequest("/event/" + config.get("TBA.event_key") + "/matches").then((data) => {
            module.TBAdata.matches = data
            module.TBAdata.nextTeamMatch = (data.filter(a => a.alliances.red.team_keys.includes(config.get("TBA.team_key")) && !a.score_breakdown)).concat((data.filter(a => a.alliances.blue.team_keys.includes(config.get("TBA.team_key")) && !a.score_breakdown)).sort((a, b) => a.match_number < b.match_number).filter(a.time != null && a.time != -1))[0];
        }));

        module.firstTime = false;
        Promise.all(promises).then(resolve);
    })
}

module.sendTBARequest = (url) => {
    return new Promise((resolve) => {
        var options = {
            method: 'GET',
            url: 'http://www.thebluealliance.com/api/v3' + url,
            headers: {
                'X-TBA-Auth-Key': process.env.TBA_KEY,
                'Content-Type': 'application/json'
            },
            json: true
        };
        data = {}
        // Send actual HTTP request
        request(options, (error, response, body) => {
            if (error) throw new Error(error);
            resolve(body)
        })
    })
}