const reportSchemas = require("./../reportSchemas")
const winston = require('winston');

module.exports.render = (req, res, page, variables) => {
    if(!variables)
        variables = {}
    variables.tba = req.tba
    variables.reportSchemas = reportSchemas
    res.render(page, variables)
}

module.exports.getScout = (req, res, next) => {
    let schemaMatches = reportSchemas.filter(a => a.name == req.params.reportName);
    if(schemaMatches.length < 1)
        next()
    else{
        module.exports.render(req, res, "scout", {schema: schemaMatches[0]})
        
    }
}