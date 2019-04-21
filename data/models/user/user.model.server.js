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
    userModel.find({
        userName: userName,
        passWord: passWord
    });

createUser = (newUser) =>
    userModel.create(newUser);

findUserById = userId =>
    userModel.findOne({
        _id: userId
    });

module.exports = {
    findAllUsers,
    findUserById,
    findUserByUserName,
    findUserByCredentials,
    createUser
};
