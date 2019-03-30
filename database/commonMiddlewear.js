const winston = require('winston');
const mongoose = require('mongoose')
const tba = require("../tba.js");

const reportModel = mongoose.model("Report")

module.exports.injectAllReports = (req, res, next) => {
    reportModel.find({tournament: tba.event.name + " " + tba.event.year}).sort({submittedAt:-1}).exec((err, reports) => {
        if(err){
            req.flash("error", "Error getting reports.")
            next();
        }else{
            req.reports = JSON.parse(JSON.stringify(reports))
            next();
        }
    })
}