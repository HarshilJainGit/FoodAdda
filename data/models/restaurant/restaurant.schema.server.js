const mongoose = require('mongoose');
const restaurantSchema =
    mongoose.Schema({
        _id : String,
        name : String,
        location : String,
        image_url : String,
        phone : String,
        email : String,
        address : String,
        rating : Number,
        reviews : [{type: mongoose.Schema.Types.String, ref: 'ReviewModel'}],
    }, {collection: 'restaurant'});
module.exports = restaurantSchema;
