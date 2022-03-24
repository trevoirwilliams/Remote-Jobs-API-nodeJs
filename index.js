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
    axios.get("https://stackoverflow.com/jobs?r=true").then((response) => {
        const page = response.data;
        console.log(page);
        const $ = cheerio.load(page);
        
        $('[data-jobid]', page).each(function(){
            var joblink = $(this).find('div > div > div > h2 > a');
            var image = $(this).find('img').attr('src');
            var url = joblink.attr('href');
            var company = $(this).find('div > div > div > h3 > span').first().text().trim();
            var title = joblink.text();
            jobs.push({
                image,
                url,
                title,
                company
            });
        });
        res.json(jobs);
    });
    
});

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})