const axios = require('axios');
const stackOverFlowParser = require('./parsers/parseStackOverflowJobs');
const weWorkRemotelyParser = require('./parsers/parseWeWorkRemotelyJobs');
const parsers = [stackOverFlowParser, weWorkRemotelyParser];

module.exports = function (app) {
	
    app.get('/remotejobs', (req, res) => {
        const jobs = [];
        var requests = parsers.map(q => q.axiosRequest);
        
        axios.all(requests).then(axios.spread((...responses) => {
            jobs.push(
                ...stackOverFlowParser.parseJobs(responses[0]),
                ...weWorkRemotelyParser.parseJobs(responses[1])
            );
            res.json(jobs);
          })).catch(errors => {
              console.log(errors);
            res.status(500).send(errors);
        });
    });
    
    app.get('/remotejobs/:sourceId', (req, res) => {
        const sourceId = req.params.sourceId;
        const parser = parsers.filter(src => src.sourceId == sourceId)[0];
        const specificJobs = [];
    
        if(!parser){
            res.status(404).send("Source Id Not Supported");
        }
        
        parser.axiosRequest.then((response) => {
            specificJobs.push(...parser.parseJobs(response));
            res.json(specificJobs);
        }).catch(errors => {
            console.log(errors);
            res.status(500).send(errors);
        }); 
    });
    
    app.get('/jobs/sources', (req, res) => {
        const result = parsers.map(src => ({ Name: src.Name, SourceId: src.sourceId }));
        res.json(result);
    });

}