const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const request = require('request');
require('./data/db')();
const yelp = require('yelp');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:5000");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

const yelpApi = new yelp({
    consumer_key: 'MYwDRfy56r-jAcraQG0RaQ',
    consumer_secret: '12345',
    token: 'ss4-t75R3qifJTmT5KQT_Wg46lOf_kEMgaX-5ivOLIbO-hHhibMS7SDyAib7Ql5ZL9hQPVnJDup0hVxS9JEy6ND-wmFcid3Hq_se7FMnz06TCwaPCo83iEMLaxW6XHYx',
    token_secret: '54321',
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/home', (req, res) => {
    console.log('In Yelp')
    yelpApi.search({location: 'Montreal'}).then(
        resp => {
            res.send(resp)
        }
    )
    // console.log('InHOme');
    // request.get('https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco/reviews').then(
    //     resp => console.log(resp)
    // );
});

app.listen(process.env.PORT || 5000);
