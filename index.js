const express = require('express');
const request = require('request-promise');
const cheerio = require('cheerio');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Welcome To Job Scraper API');
});

app.get('/remotejobs', (req, res) => {
    axios.get("https://stackoverflow.com/jobs?r=true").then((res) => {
        const page = res.data;
        console.log(page);
        const $ = cheerio.load(page);

        $('div.flex--item fl1 ', page).each(function(){
            const title = $(this).text();
            const text = $(this).Text;
            const url = $(this).attr('href');
            console.log(`${title} ${text} ${url}`)
        })
    });
});

app.listen(PORT, () => {console.log(`Server running on ${PORT}`)})