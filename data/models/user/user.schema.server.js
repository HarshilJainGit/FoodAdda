const mongoose = require('mongoose');
const userSchema =
    mongoose.Schema({
        _id: String,
        userName: String,
        name: String,
        passWord: String,
        firstName: String,
        lastName: String,
        image_url: String,
        email: String,
        dob: Date,
        phone: String,
        role: {type: String, enum: ['Admin', 'Foodie', 'Restaurant Owner']},
        city: String,
        favRest: [{type: mongoose.Schema.Types.String, ref: 'RestaurantModel'}],
        createdRest: [{type: mongoose.Schema.Types.String, ref: 'RestaurantModel'}],
        reviews: {type: mongoose.Schema.Types.String, ref: 'ReviewModel'}
    }, {collection: 'user'});
module.exports = userSchema;
