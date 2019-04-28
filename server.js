var request = require('request');
var cheerio = require('cheerio');
// var URL = require('url-parse');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
// const axios = require('axios');

app.use(express.static('views'));
app.use(express.static('scripts'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('index.html');
});

app.post('/crawlWord', (req, res) => {
    const word = req.body.params.word;
    console.log("got %s", word);
    let START_URL = "https://ko.wikipedia.org/wiki/" + encodeURIComponent(word);
    request(START_URL, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            console.log("ERROR crawlWord function");
            return;
        }
        let $ = cheerio.load(body);
        let title = $('html > body > #content > #firstHeading').text();
        let bodyText = $('html > body > #content > #bodyContent > #mw-content-text > .mw-parser-output > p').first().text();
        let replaced = bodyText.toLowerCase().split(title.toLowerCase()).join("\"이것\"").split(word.toLowerCase()).join("\"이것\"").replace(/ *\([^)]*\) */g, "");
        // console.log("%s --> %s", bodyText, replaced);
        // console.log("q:" + replaced);
        return res.json({value: replaced, answer: title.toLowerCase(), answer2: word.toLowerCase()});
    });
});

app.post('/checkWord', (req, res) => {
    console.log(req.body.params.word);
    const word = req.body.params.word;
    console.log("check got %s", word);
    let START_URL = "https://ko.wikipedia.org/wiki/" + encodeURIComponent(word);
    request(START_URL, function (error, response, body) {
        // Check status code (200 is HTTP OK)
        if (response === undefined) {
            console.log("response undefined");
            return res.json({result: false});
        }
        console.log("Status code: " + response.statusCode);
        if (response.statusCode !== 200) {
            console.log("ERROR crawlWord function");
            return res.json({result: false});
        }
        return res.json({result: true});
    });
});

const server = app.listen(8000, () => {
    console.log(`server is running at port 8000`);
});