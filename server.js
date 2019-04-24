const expressSession = require('express-session');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

const yelp = require('yelp-fusion');
const client = yelp.client('ss4-t75R3qifJTmT5KQT_Wg46lOf_kEMgaX-5ivOLIbO-hHhibMS7SDyAib7Ql5ZL9hQPVnJDup0hVxS9JEy6ND-wmFcid3Hq_se7FMnz06TCwaPCo83iEMLaxW6XHYx');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin",
        "http://localhost:4200");
        // "https://foodadda-webdevproj.herokuapp.com");
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
require('./data/db')();

const restDao = require('./data/daos/restaurant.dao.server');
const userModel = require('./data/models/user/user.model.server');
const revModel = require('./data/models/review/review.model.server');

//Get businesses for location
app.get('/api/home', (req, res) => {
    client.search({
        location: 'new york',
        categories: 'Food',
        sort_by: 'rating'
    }).then(response => {
        res.send(response.jsonBody.businesses);
    }).catch(e => {
        console.log(e);
    });
});

//Get restaurant details
app.get('/api/restaurant/:id/det', (req,res) => {
    let rest = [];
    client.business(req.params.id).then (response => {
        return rest.concat(response.jsonBody);
    }).then((ress) => {
        restDao.getRestaurantById(req.params.id).then(
            resp => {
                if(resp === null) {
                    res.send(ress[0])
                }
                else {
                    res.send(ress.concat(resp))
                }
            }
        )
    }).catch(e => {
        restDao.getRestaurantById(req.params.id).then(
            resty => {
                res.send(resty)
            }
        );
        console.log(e);
    });
});

//Get reviews for particular restaurant id
app.get('/api/restaurant/:id', (req,res) => {
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

createRest = (req,res) => {
    const currentUser = req.session['currentUser'];
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
            return response;
        }
    ).then(() => {
        userModel.createRestList(currentUser._id, restId).then(
            resp => {
                res.send(resp)
            })
    });
};

app.post('/api/restaurant',createRest);

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
                res.send(403);
            }
        });
}

//User Login
app.post('/api/login',login);

//User Profile
app.get('/api/profile');

function register(req,res) {
    const userId = Date.now();
    const userName = req.body.userName;
    const lastName = req.body.lastName;
    const firstName = req.body.firstName;
    const email = req.body.email;
    const phone = req.body.phone;
    const passWord = req.body.passWord;
    const role = req.body.role;
    const name = firstName + ' '+ lastName;
    // const image_url = req.body.image_url;
    const image_url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6dz9gihQ9k_G92EryW9SlmPr5GmPRZxYF_ouPWLaZ4MiBw7fw';
    let newUser = {
        _id : userId,
        userName : userName,
        firstName : firstName,
        lastName : lastName,
        email : email,
        passWord : passWord,
        role: role,
        name: name,
        phone: phone,
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
app.post('/api/register',register);

function logout(req,res) {
    req.session.destroy();
    res.send(200);
}

//Logout User
app.post('/api/logout',logout);

app.get('/api/users/:userName',(req,res) => {
    userModel.findUserByUserName(req.params.userName).then(
        users => {
            res.send(users)
        }
    );
});

currentUser = (req, res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.findUserById(currentUser._id)
            .then(user => res.send(user))
    } else {
        res.sendStatus(403)
    }
};

app.get('/api/currentUser',currentUser);

favourite = (req,res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.findUserById(currentUser._id)
            .then((user) => {
                return userModel.addToFavourites(user._id,req.params.id).then(
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
        userModel.getUserFavs(currentUser._id)
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
            return followModel.deleteFollowing(req.params.id).then(
                status => {
                    return revModel.deleteReviewsForUser(req.params.id).then(
                        rets => {
                            return userModel.findAllUsers().then(
                                users => res.send(users)
                            )
                        }
                    )
                }
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

app.get('/api/:search',searchRest);

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

app.get('/api/blanksearch',searchhh);

deleteFromFav = (req,res) => {
    const currentUser = req.session['currentUser'];
    if (currentUser) {
        userModel.findUserById(currentUser._id)
            .then((user) => {
                return userModel.deleteFromFavourites(user._id, req.params.id).then(
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

getUserById = (req,res) => {
    userModel.findUserById(req.params.id).then(
        user => {
            res.send(user);
        }
    )
};

app.get('/api/profile/:id',getUserById);

getRecentRests = (req,res) => {
    restDao.getRecentRests().then(
        rests => {
            res.send(rests);
        }
    )
};

app.get('/api/restaurantList/recent',getRecentRests);

getReviewsByUser = (req,res) => {
    revModel.getReviewsByUser(req.params.id).then(
        resp => {
            res.send(resp);
        }
    )
};

app.get('/api/user/:id/reviews',getReviewsByUser);

getRestCreated = (req,res) => {
    const currentUser = req.session['currentUser'];
    if(currentUser) {
        userModel.getUserCreatedRest(currentUser._id)
            .then(
                (createdRest) => res.send(createdRest)
            )
    } else {
        res.sendStatus(403);
    }
};

app.get('/api/user/createdrest',getRestCreated);


//Followers
const followModel=require('./data/models/follow/follow.model.server');

getFollowers = (req,res) => {
    const userId=req.params.id;
    followModel.findAllFollowers(userId).then(
        function (response) {
            res.json(response);
        });
};

getAllFollow = (req,res) => {
    followModel.getAllFollow().then(
        function (response) {
            res.json(response);
        });
};

follow = (req,res) => {
    const follower = req.params.follower;
    const following = req.params.following;
    const newFollow = new Object();
    newFollow.follower = follower;
    newFollow.following = following;
    followModel.createFollow(newFollow).then(
        function (response) {
                res.sendStatus(200)
            },
            function (err) {
                res.sendStatus(404);
            });
};

deleteFollow = (req,res) => {
    const followId=req.params.id;
    followModel.deleteFollows(followId)
        .then(function (response) {
                res.sendStatus(200);
            },
            function (err) {
                res.sendStatus(404);
            });
};

unfollow = (req,res) => {
    const follower=req.params.follower;
    const following=req.params.following;
    followModel.deleteFollow(follower,following)
        .then(function (response) {
                res.sendStatus(200);
            },
            function (err) {
                res.sendStatus(404);
            });
};

getFollowing = (req,res) => {
    const userId=req.params.id;
    followModel.findAllFollowing(userId)
        .then(function (response) {
            res.json(response);
        });
};


app.get    ("/api/followers/:id",getFollowers);
app.put    ("/api/createFollow/:follower/:following",follow);
app.delete ("/api/unfollow/:follower/:following",unfollow);
app.get    ("/api/getFollowing/:id",getFollowing);
app.get    ("/api/getallfollow",getAllFollow);
app.delete ("/api/deletefollow/:id",deleteFollow);

updRestaurant = (req,res) => {
    restDao.updateRest(req.params.id,req.body).then(
        status => res.send(status)
    )
};

app.put('/api/restaurant/:id/update',updRestaurant);

deleteRest = (req,res) => {
    restDao.deleteRest(req.params.id).then(
        status => {
            return revModel.delReviewsForRest(req.params.id).then(
                stats => {
                    res.send(stats);
                }
            )

        }
    )
};

app.delete('/api/restaurant/:id/del',deleteRest);

app.listen(process.env.PORT || 4000);
