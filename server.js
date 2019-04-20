const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const request = require('request');
require('./data/db')();
const yelp = require('yelp-fusion');

const client = yelp.client('ss4-t75R3qifJTmT5KQT_Wg46lOf_kEMgaX-5ivOLIbO-hHhibMS7SDyAib7Ql5ZL9hQPVnJDup0hVxS9JEy6ND-wmFcid3Hq_se7FMnz06TCwaPCo83iEMLaxW6XHYx');
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/home', (req, res) => {
    client.search({
        term: 'Four Barrel Coffee',
        location: 'san francisco, ca',
    }).then(response => {
        res.send(response);
    }).catch(e => {
        console.log(e);
    });
    // console.log('InHOme');
    // request.get('https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco/reviews').then(
    //     resp => console.log(resp)
    // );
});

app.listen(process.env.PORT || 5000);
