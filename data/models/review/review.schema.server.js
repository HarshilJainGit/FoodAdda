const mongoose = require('mongoose');
const reviewSchema =
    mongoose.Schema({
        id : String,
        restaurantId: {type: mongoose.Schema.Types.String, ref: 'RestaurantModel'},
        user : {type: mongoose.Schema.Types.Number, ref: 'UserModel'},
        time_created : String,
        text : String
    }, {collection: 'review'});
module.exports = reviewSchema;
