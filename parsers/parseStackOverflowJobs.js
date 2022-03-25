const cheerio = require('cheerio');
const axios = require('axios');
const stackoverflowUrl = "https://stackoverflow.com";
const jobs = [];
const Name = "Stack Overflow";
const sourceId = "stack";

exports.sourceId = sourceId;
exports.url = stackoverflowUrl;
exports.axiosRequest = axios.get(stackoverflowUrl + "/jobs?r=true");
exports.parseJobs = function(response) {
    const page = response.data;
    const $ = cheerio.load(page);

    $('[data-jobid]', page).each(function(){
        var joblink = $(this).find('div > div > div > h2 > a');
        var url = stackoverflowUrl + joblink.attr('href');
        var company = $(this).find('div > div > div > h3 > span').first().text().trim();
        var title = joblink.text();
        jobs.push({
            url,
            title,
            company,
            Name,
            sourceId
        });
    });
    return jobs;
};  


