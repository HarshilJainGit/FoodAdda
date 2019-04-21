const expressSession = require('express-session');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
require('./data/db')();
const yelp = require('yelp-fusion');

const client = yelp.client('ss4-t75R3qifJTmT5KQT_Wg46lOf_kEMgaX-5ivOLIbO-hHhibMS7SDyAib7Ql5ZL9hQPVnJDup0hVxS9JEy6ND-wmFcid3Hq_se7FMnz06TCwaPCo83iEMLaxW6XHYx');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
    res.header("Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(expressSession({
    resave: false, saveUninitialized: true,
    secret: 'EverythingIsPlanned'
}));


const restDao = require('./data/daos/restaurant.dao.server');
const userModel = require('./data/models/user/user.model.server');

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
        res.send(reviews.jsonBody.reviews);
    }).catch( e => {
        console.log('Error getting reviews');
    })
});

app.post('/restaurant',(req, res) => {
    restDao.createRestaurant(req.body).then(
        response => {
            res.send(response);
        }
    )
});

function login(req,res) {
    const userName = req.body.userName;
    const passWord = req.body.passWord;
    userModel
        .findUserByCredentials(userName, passWord)
        .then(function (user) {
            if(user) {
                req.session['currentUser'] = user;
                res.send(user);
            } else {
                res.send(0);
            }
        });
}

//User Login
app.post('/login',login);

//User Profile
app.get('/profile');

function register(req,res) {
    const userId = Date.now();
    const userName = req.body.userName;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const email = req.body.email;
    const passWord = req.body.passWord;
    let newUser = {
        _id : userId,
        userName : userName,
        firstName : firstName,
        lastName : lastName,
        email : email,
        passWord : passWord
    };
    console.log(newUser);
    userModel.findUserByUserName(userName).then(
        function (user) {
            if(user === null || user.length === 0) {
                console.log('User not found with username');
                return userModel.createUser(newUser).then (
                    newuser => {
                        return newuser
                    }
                )
            }
            else {
                res.send(403);
            }
        }
        ).then(function (user) {
            req.session['currentUser'] = user;
            res.send(user);
        });
}

//New user registration
app.post('/register',register);

function logout(req,res) {
    req.session.destroy();
    res.send(200);
}

//Logout User
app.post('/logout',logout);

app.get('/users/:userName',(req,res) => {
    userModel.findUserByUserName(req.params.userName).then(
        users => {
            res.send(users)
        }
    );
});

currentUser = (req, res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.findUserById(currentUser[0]._id)
            .then(user => res.send(user))
    } else {
        res.sendStatus(403)
    }
};

app.get('/currentUser',currentUser);

app.listen(process.env.PORT || 5000);
