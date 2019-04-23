const mongoose = require('mongoose');
const userSchema =
    mongoose.Schema({
        id : String,
        userName : String,
        name: String,
        passWord : String,
        firstName : String,
        lastName : String,
        image_url: String,
        email : String,
        dob : Date,
        role: { type: String, enum: ['Admin', 'Foodie', 'Restaurant Owner'] },
        city : String,
        favRest : [{type: mongoose.Schema.Types.String, ref: 'RestaurantModel'}],
        lastViewed : [{type: mongoose.Schema.Types.String, ref: 'RestaurantModel'}],
        reviews : {type: mongoose.Schema.Types.String, ref: 'ReviewModel'}
    }, {collection: 'user'});
module.exports = userSchema;
