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
const revModel = require('./data/models/review/review.model.server');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Get businesses for location
app.get('/home', (req, res) => {
    let rest = [];
    client.search({
        location: 'san francisco, ca',
    }).then(response => {
        return rest.concat(response.jsonBody.businesses);
    }).then((ress) => {
      restDao.getRestaurants().then(
          resp => {
              res.send(ress.concat(resp))
          }
      )
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
    let reviewsList = [];
    client.reviews(req.params.id).then ( reviews => {
        return reviewsList.concat(reviews.jsonBody.reviews);
    }).then((ress) => {
        revModel.getReviews(req.params.id).then(
            resp => {
                res.send(ress.concat(resp))
            }
        )
    }
    ).catch(() => {
        revModel.getReviews(req.params.id).then(
            resp => {
                res.send(resp)
            }
        );
        console.log('No reviews on Yelp');
    })
});

app.post('/restaurant',(req, res) => {
    const restId = Date.now();
    const restName = req.body.name;
    const restPhone = req.body.phone;
    const restEmail = req.body.email;
    const restImage = req.body.image_url;
    const restAddress = req.body.location;

    let newRest = {
        id: restId,
        name: restName,
        phone: restPhone,
        email: restEmail,
        image_url: restImage,
        location: restAddress
    };
    restDao.createRestaurant(newRest).then(
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
    const role = req.body.role;
    const name = firstName + ' '+ lastName;
    // const image_url = req.body.image_url;
    const image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dz9gihQ9k_G92EryW9SlmPr5GmPRZxYF_ouPWLaZ4MiBw7fw';
    let newUser = {
        id : userId,
        userName : userName,
        firstName : firstName,
        lastName : lastName,
        email : email,
        passWord : passWord,
        role: role,
        name: name,
        image_url: image_url
    };
    userModel.findUserByUserName(userName).then(
        function (user) {
            if(user === null || user.length === 0) {
                return userModel.createUser(newUser);
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
        userModel.findUserById(currentUser.id)
            .then(user => res.send(user))
    } else {
        res.sendStatus(403)
    }
};

app.get('/currentUser',currentUser);

favourite = (req,res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.findUserById(currentUser.id)
            .then((user) => {
                return userModel.addToFavourites(user.id,req.params.id).then(
                    user1 => {
                        res.send(user1)
                    }
                )
            })
    } else {
        res.sendStatus(403)
    }
};

app.put('/api/restaurant/:id/fav',favourite);

getFavs = (req,res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.getUserFavs(currentUser.id)
            .then(
                (favouriteRest) => res.send(favouriteRest)
            )
    } else {
        res.sendStatus(403)
    }
};

app.get('/api/favrest',getFavs);

delUser = (req,res) => {
    userModel.deleteUser(req.params.id).then(
        () => {
            return userModel.findAllUsers().then(
                users => res.send(users)
            )
        }
    )
};

app.delete('/api/user/:id',delUser);

updUser = (req,res) => {
   userModel.updateUser(req.params.id,req.body).then(
       () => {
           return userModel.findAllUsers().then(
               users => res.send(users)
           )
       }
   )
};

app.put('/api/user/:id',updUser);

getUsers = (req,res) => {
    userModel.findAllUsers().then(
        users => res.send(users)
    )
};
app.get('/api/user/',getUsers);

searchRest = (req,res) => {
    client.search({
        location: req.query.location,
        term: req.query.term
    }).then(response => {
        res.send(response.jsonBody.businesses)
    }).catch(e => {
        console.log(e);
    });
};

app.get('/:search',searchRest);

addReview = (req,res) => {
    const currentUser = req.session['currentUser'];
    const revId = Date.now();
    const revTime = (new Date()).toString();
    const revRestId = req.params.id;
    const revText = req.body.text;
    let newReview = {
        id: revId,
        user: currentUser,
        restaurantId: revRestId,
        time_created: revTime,
        text: revText
    };
    revModel.createReview(newReview).then(
        response => {
            res.send(response);
        }
    )
};

app.post('/api/restaurant/:id/review',addReview);

searchhh = (req,res) => {
    client.businessMatch({
        city: 'Boston',
        name: 'Boston Shawarma',
        address1 : ' '
    }).then(response => {
        res.send(response.jsonBody.businesses)
    }).catch(e => {
        console.log(e);
    });
};

app.get('/blanksearch',searchhh);

deleteFromFav = (req,res) => {
    const currentUser = req.session['currentUser'];
    if (currentUser) {
        userModel.findUserById(currentUser.id)
            .then((user) => {
                return userModel.deleteFromFavourites(user.id, req.params.id).then(
                    user1 => {
                        res.send(user1)
                    }
                )
            })
    } else {
        res.sendStatus(403)
    }
};

app.put('/api/restaurant/:id/delfav',deleteFromFav);

app.listen(process.env.PORT || 4000);
