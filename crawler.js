var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
let START_URL = "https://ko.wikipedia.org/wiki/"+word;
request(START_URL, function (error, response, body) {
    // Check status code (200 is HTTP OK)
    console.log("Status code: " + response.statusCode);
    if (response.statusCode !== 200) {
        callback();
        return;
    }
    // Parse the document body
    var urlBody = cheerio.load(body);
    console.log(urlBody);
    // var isWordFound = searchForWord(urlBody, SEARCH_WORD);
    // if(isWordFound) {
    //     console.log('Word ' + SEARCH_WORD + ' found at page ' + url);
    // } else {
    //     collectInternalLinks($);
    //     // In this short program, our callback is just calling crawl()
    //     callback();
    // }
});
