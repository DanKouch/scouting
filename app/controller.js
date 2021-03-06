const reportSchemas = require("./../reportSchemas")
const winston = require('winston');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const moment = require('moment')
const ordinal = require('ordinal')
const tba = require('../tba.js')

module.exports.render = (req, res, page, variables) => {
    if(!variables)
        variables = {}
    variables.tba = req.tba
    variables.reportSchemas = reportSchemas
    variables.flashMessages = {
        errors: req.flash("error"),
        successes: req.flash("success"),
        warnings: req.flash("warning"),
        info: req.flash("info") 
    }
    if(variables.reports){
        // Get Leaderboard
        variables.leaderboard = []
        variables.reports.map(a => a.submittedBy)
        variables.reports.map(a => a.submittedBy).forEach(reporter => {
            let found = false;
            variables.leaderboard.forEach((leader) => {
                if(leader.name == reporter){
                    leader.reports ++;
                    found = true;
                }
            })
            if(!found)
                variables.leaderboard.push({name: reporter, reports: 1})
        })
        variables.leaderboard = variables.leaderboard.sort((a, b) => b.reports - a.reports)
        
    }

    variables.average = (array) => {
        if(array.length == 0)
            return "Unknown"
        return (array.reduce((sum, val) => sum + parseInt(val)) / array.length)
    };

    variables.stdev = (array) => {
        let avg = variables.average(array)
        let sqDiffs = array.map((a) => Math.pow(a - avg, 2))
        let avgDiff = variables.average(sqDiffs)
        return Math.sqrt(avgDiff)
    }
    
    variables.user = req.user
    variables.moment = moment;
    variables.ordinal = ordinal;
    //req.session.flash = [];
    res.render(page, variables)
}

// SCOUTING
const reportModel = mongoose.model("Report");

module.exports.getScout = (req, res, next) => {
    let schemaMatches = reportSchemas.filter(a => a.name == req.params.reportName);
    if(schemaMatches.length < 1)
        next()
    else{
        let schema = schemaMatches[0]
        // Get Teams
        schema.fields.filter(a => a.name == "team").forEach(a => {
            if(a.hideScoutedTeams){
                let teamsScouted = req.reports.filter(a => a.schemaName == schema.name).map(a => a.team)
                a.options = req.tba.teams.sort((a, b) => parseInt(a.team_number) - parseInt(b.team_number)).map(b => (b.team_number + " - " + b.nickname)).filter(g => !teamsScouted.includes(g))
            }else{
                a.options = req.tba.teams.sort((a, b) => parseInt(a.team_number) - parseInt(b.team_number)).map(b => (b.team_number + " - " + b.nickname))
            }
            module.exports.render(req, res, "scout", {schema: schema})
        });

        
    }
}

module.exports.postScout = (req, res, next) => {
    let schemaMatches = reportSchemas.filter(a => a.name == req.params.reportName);
    if(schemaMatches.length < 1)
        next()
    else{
        // Only take information in schema (Prevents clients sending in random data)
        let data = {}
        data.schemaName = schemaMatches[0].name
        data.submittedBy = req.user.name
        let keys = schemaMatches[0].fields.map(a => a.name);
        keys.forEach(key => {
            if(req.body.hasOwnProperty(key)){
                data[key] = req.body[key]
            }
        })
        winston.warn(data)
        reportModel.create(data, (err, report) => {
			module.exports.mongooseHandler(req, res, err, report, (report, successful) => {
                if(successful){
                    winston.warn("Scccess")
                    req.flash("success", "Successfully submitted report.")
                }
                res.redirect(req.url)
            })
		});

    }
}


// USERS

const userModel = mongoose.model("User");

module.exports.postUser = (req, res) => {
    bcrypt.hash(req.body.password, 512, (bcryptError, hashedPassword) => {
        if(bcryptError){
            req.flash("error", "BCrypt error creating user.")
            winston.error("Bcrypt Error: " + bcryptError);
            if(!res.headerSent)
                module.exports.render(req, res, "register")
        }
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        }, (err, user) => {
            module.exports.mongooseHandler(req, res, err, user, (user, successful) => {
                if(successful){
                    req.flash("success", "Successfully registered " + user.name + ".")
                }
                module.exports.render(req, res, "register")
            })
        });
    });
}

module.exports.mongooseHandler = (req, res, err, data, callback) => {
    if(err || !data){
        winston.warn(err)
        for(var key in err.errors){
            if(err.errors.hasOwnProperty(key)){
                if(err.errors[key].name != "ValidatorError"){
                    winston.error(JSON.stringify(err.errors[key]))
                    req.flash("error", "Could not complete request.")    
                }else{
                    req.flash("error", err.errors[key].message)
                }
            }
        }
        callback(null, false)
    }else{
        callback(data, true);
    }
}

module.exports.postLogin = (req, res) => {
    winston.silly(req.user)
}

module.exports.getLogout = (req, res) => {
    req.logout();
    res.redirect('/login');
}

module.exports.ensureAdministrator = (req, res, next) => {
    if (req.isAuthenticated() && (req.user.role == "administrator"))
        next()
    else{
        req.flash("warn", "You do not have permission to access that page.")
        res.redirect("/");
    }
}

//https://stackoverflow.com/a/44391621/3746623
String.prototype.replaceAll = String.prototype.replaceAll || function(string, replaced) {
    return this.replace(new RegExp(string, 'g'), replaced);
};

module.exports.getDataCSV = (req, res, next) => {
    let schemaMatches = reportSchemas.filter(a => a.name == req.params.reportName);
    if(schemaMatches.length < 1){
        next()
        return;
    }
    let schema = schemaMatches[0];
    let rawReports = req.reports.filter(a => a.schemaName == schema.name);
    res.set("Content-Type", "text/csv")
    res.set("Conent-Disposition", "attachment;filename=" + schema.name + ".csv")
    schema.fields.filter(a => a.name).forEach(field => {
        res.write(field.description + ",")
    })
    res.write("Submitted By,Submitted At")
    rawReports.forEach(report => {
        res.write("\n")
        schema.fields.filter(a => a.name).forEach(field => {
            res.write(report[field.name].replaceAll(",", ";").replaceAll("\n", ";").replaceAll("\r", "") + ",")
        })
        res.write(report.submittedBy + "," + report.submittedAt)
    })
    res.end()
}

module.exports.changeUserPassword = (req, res) => {
    if(req.body && req.body.name && req.body.password){
        bcrypt.hash(req.body.password, 512, (bcryptError, hashedPassword) => {
            if(bcryptError){
                req.flash("error", "BCrypt error creating user.")
                winston.error("Bcrypt Error: " + bcryptError);
                if(!res.headerSent)
                    module.exports.render(req, res, "register")
            }
            userModel.findOneAndUpdate({name: req.body.name}, {
                password: hashedPassword
            }, (err) => {
                if(err){
                    req.flash("error", "Error updating password.")
                    res.redirect("/users")
                    return;
                }
                req.flash("success", "Successfully updated " + req.body.name + "'s password.")
                res.redirect("/users")
            })
        })
    }else{
        req.flash("error", "Invalid request parameters")
        res.redirect("/users")
    }
}

module.exports.deleteUser = (req, res) => {
    if(req.body && req.body.name){
        userModel.deleteOne({name: req.body.name}, (err) => {
            if(err){
                req.flash("error", "Error removing user from database.")
                res.redirect("/users")
                return;
            }
            req.flash("success", "Successfully terminated " + req.body.name + ".")
            res.redirect("/users")
        })
    }else{
        req.flash("error", "Invalid request parameters")
        res.redirect("/users")
    }
}