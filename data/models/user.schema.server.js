const mongoose = require('mongoose');
const userSchema =
    mongoose.Schema({
        _id : Number,
        userName : String,
        passWord : String,
        firstName : String,
        lastName : String,
        email : String,
        dob : Date,
        role : String,
        city : String
    }, {collection: 'user'});
module.exports = userSchema;
