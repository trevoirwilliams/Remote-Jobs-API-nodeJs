const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;
const jobs = [];

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome To Job Scraper API');
});

app.get('/remotejobs', (req, res) => {
    const stackoverflowUrl = "https://stackoverflow.com";
    axios.get(stackoverflowUrl + "/jobs?r=true")
    .then((response) => {
        const page = response.data;
        const $ = cheerio.load(page);
        
        $('[data-jobid]', page).each(function(){
            var joblink = $(this).find('div > div > div > h2 > a');
            // var image = $(this).find('img').attr('src');
            var url = stackoverflowUrl + joblink.attr('href');
            var company = $(this).find('div > div > div > h3 > span').first().text().trim();
            var title = joblink.text();
            jobs.push({
                // image,
                url,
                title,
                company
            });
        });
        console.log(jobs);
    }).then((response) => {
        const weworkUrl = "https://weworkremotely.com";
        axios.get(weworkUrl).then((response) => {
            const page = response.data;
            const $ = cheerio.load(page);
            
            $('li.feature', page).each(function(){
                var joblink = $(this).find('a');
                // var image = $(this).find('img').attr('src');
                var url = weworkUrl + joblink.attr('href');
                var company = joblink.find('span.company').text().trim();
                var title = joblink.find('span.title').first().text().trim();
                jobs.push({
                    // image,
                    url,
                    title,
                    company
                });
            });
            console.log(jobs);
            res.json(jobs);
        });    
    });
});

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})