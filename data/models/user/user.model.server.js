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
        id: userId
    });

addToFavourites = (userId,restId) =>
    userModel.update(
        {id: userId}
        ,{$push: {favRest: {id: restId}}
        }
    );

getUserFavs = (userId) =>
    userModel.findOne(
        {id: userId}, {favRest: 1, id: 0}
    );

deleteUser = (userId) =>
    userModel.findOneAndRemove({
        id: userId
    });

updateUser = (userId,updUser) =>
    userModel.updateOne(
        {id:userId},{$set:updUser}
    );

deleteFromFavourites = (userId,restId) =>
    userModel.update({id:userId},
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
