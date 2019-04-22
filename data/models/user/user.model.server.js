const mongoose = require('mongoose');
const userSchema = require('./user.schema.server');
const userModel = mongoose.model('UserModel', userSchema);

findAllUsers = () =>
    userModel.find();

findUserByUserName = (userName) =>
    userModel.findOne({
        userName : String(userName)
    });

findUserByCredentials = (userName,passWord) =>
    userModel.findOne({
        userName: userName,
        passWord: passWord
    });

createUser = (newUser) =>
    userModel.create(newUser);

findUserById = (userId) =>
    userModel.findOne({
        _id: userId
    });

addToFavourites = (userId,restId) =>
    userModel.update(
        {_id: userId}
        ,{$push: {favRest: {_id: restId}}
        }
    );

getUserFavs = (userId) =>
    userModel.find(
        {_id: userId}, {favRest: 1, _id: 0}
    );

module.exports = {
    findAllUsers,
    findUserById,
    findUserByUserName,
    findUserByCredentials,
    createUser,
    addToFavourites,
    getUserFavs
};
