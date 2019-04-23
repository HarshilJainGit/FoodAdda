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
        ,{$push: {favRest:restId}
        }
    );

getUserFavs = (userId) =>
    userModel.findOne(
        {_id: userId}, {favRest: 1, _id: 0}
    );

deleteUser = (userId) =>
    userModel.findOneAndRemove({
        _id: userId
    });

updateUser = (userId,updUser) =>
    userModel.updateOne(
        {_id:userId},{$set:updUser}
    );

deleteFromFavourites = (userId,restId) =>
    userModel.update({_id:userId},
        {$pull:{favRest:restId}}
    );

module.exports = {
    findAllUsers,
    findUserById,
    findUserByUserName,
    findUserByCredentials,
    createUser,
    addToFavourites,
    getUserFavs,
    deleteUser,
    updateUser,
    deleteFromFavourites
};
