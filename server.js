const express = require('express');
const app = express();
const bodyParser = require("body-parser");
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

//Get businesses for location
app.get('/home', (req, res) => {
    client.search({
        location: 'san francisco, ca',
    }).then(response => {
        res.send(response.jsonBody.businesses);
    }).catch(e => {
        console.log(e);
    });
});

//Get restaurant details
app.get('/restaurant/:id/det', (req,res) => {
    console.log(req.params.id);
    client.business(req.params.id).then ( business => {
        res.send(business.jsonBody);
    }).catch( e => {
        console.log('Error getting business details');
    })
});

//Get reviews for particular restaurant id
app.get('/restaurant/:id', (req,res) => {
    console.log(req.params.id);
    client.reviews(req.params.id).then ( reviews => {
        res.send(reviews.jsonBody);
    }).catch( e => {
        console.log('Error getting reviews');
    })
});


app.listen(process.env.PORT || 5000);
