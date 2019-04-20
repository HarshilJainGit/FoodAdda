const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const request = require('request');
require('./data/db')();

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

app.get('/home', (req, res) =>
    res.send('Helllo')
    // console.log('InHOme');
    // request.get('https://api.yelp.com/v3/businesses/north-india-restaurant-san-francisco/reviews').then(
    //     resp => console.log(resp)
    // );
);

app.listen(process.env.PORT || 5000);
