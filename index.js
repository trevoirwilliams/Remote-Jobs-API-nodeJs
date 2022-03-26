const express = require('express');
const axios = require('axios');
const app = express(), fs = require('fs');
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

const PORT = process.env.PORT || 8000;
const stackOverFlowParser = require('./parsers/parseStackOverflowJobs');
const weWorkRemotelyParser = require('./parsers/parseWeWorkRemotelyJobs');
const parsers = [stackOverFlowParser, weWorkRemotelyParser];

app.use(express.json());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.get('/', (req, res) => {
    res.send('Welcome To Remote Job Scraper API');
});



require('./endpoints')(app)

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})
