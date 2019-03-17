const glob = require("glob")
const path = require("path")
const winston = require("winston")

reportSchemas = [];

glob.sync("./reportSchemas/*.js").forEach((file) => {
    reportSchemas.push(require(path.resolve(file)))
})

// Schema Validation
reportSchemas.forEach((s) => {
    if(!s.title) throw new Error("Schema Validation Error - No Title")
    if(!s.fields) throw new Error("Schema Validation Error - No Fields")
    s.fields.forEach((f) => {
        if(f.sectionTitle && typeof f.sectionTitle == "string")
            return
        if(!f.name) throw new Error("Schema Validation Error - Unnamed Field")
        if(!f.description) throw new Error("Schema Validation Error - " + f.name + " has no Discription")
        if(!f.type) throw new Error("Schema Validation Error - " + f.name + " has no Type")
        if(!(f.type == "number" || f.type == "text" || f.type == "dropdown" || f.type == "stars" || f.type == "yes/no" || f.type == "textarea")) throw new Error("Schema Validation Error - " + f.name + " has Invalid Type")
        if(f.type == "dropdown")
            if(!f.options && f.name != "team") throw new Error("Schema Validation Error - " + f.name + " has no Type")
    })
})

winston.info("Successfully loaded the following report schemas: " + JSON.stringify(reportSchemas.map(s => s.title)))

module.exports = reportSchemas