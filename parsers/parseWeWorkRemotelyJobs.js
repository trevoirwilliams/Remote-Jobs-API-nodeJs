const cheerio = require('cheerio');
const axios = require('axios');

const weworkUrl = "https://weworkremotely.com";
const jobs = [];
const Name = "We Work Remotely"
const sourceId = "wework";
exports.Name= Name;
exports.url = weworkUrl;
exports.axiosRequest = axios.get(weworkUrl);
exports.sourceId = sourceId;
exports.parseJobs = function (response){
    const page = response.data;
    const $ = cheerio.load(page);
    
    $('li.feature', page).each(function(){
        var joblink = $(this).find('a');
        var url = weworkUrl + joblink.attr('href');
        var company = joblink.find('span.company').text().trim();
        var title = joblink.find('span.title').first().text().trim();
        jobs.push({
            url,
            title,
            company,
            Name,
            sourceId
        });
    });
    return jobs;
}


