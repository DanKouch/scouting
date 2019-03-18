const winston = require('winston');
const mongoose = require('mongoose')
const Schema = mongoose.Schema;

// Sanitation and Validation
const sanitizer = require("mongo-sanitize")

let reportSchema = new Schema({
    submittedBy: 			{type: String, required: true},
    submittedAt: 			{type : Date, default: Date.now},

    schemaName:                 {type : String, required: true},
    tournament:             {type : String, required: true},
    team:                   {type : String, required: true}

    // Everything else is handled by the controller
}, {
    // Allows undefined attributes to be saved to database
    strict: false
});

reportSchema.plugin(sanitizer)

var reportModel = mongoose.model("Report", reportSchema);