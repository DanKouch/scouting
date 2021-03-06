const winston = require('winston');
const mongoose = require('mongoose')
const tba = require("../tba.js");

const reportModel = mongoose.model("Report")
const userModel = mongoose.model("User")

module.exports.injectAllReports = (req, res, next) => {
    reportModel.find({tournament: tba.event.name + " " + tba.event.year}).sort({submittedAt : -1}).exec((err, reports) => {
        if(err){
            req.flash("error", "Error getting reports.")
            next();
        }else{
            req.reports = JSON.parse(JSON.stringify(reports))
            next();
        }
    })
}

module.exports.injectAllUsers = (req, res, next) => {
    userModel.find({}).sort({role : -1}).exec((err, users) => {
        if(err){
            req.flash("error", "Error getting users.")
            next();
        }else{
            req.users = JSON.parse(JSON.stringify(users))
            next();
        }
    })
}