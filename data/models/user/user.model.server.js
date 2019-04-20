const mongoose = require('mongoose');
const userSchema = require('./user.schema.server');
const userModel = mongoose.model('UserModel', userSchema);

findAllUsers = () =>
    userModel.find();

findUserByUserName = (userName) =>
    userModel.find({
        userName : userName
    });

findUserByCredentials = (userName,passWord) =>
    userModel.find({
        userName: userName,
        passWord: passWord
    });

createUser = (newUser) =>
    userModel.create(newUser);

module.exports = {
    findAllUsers,
    findUserByUserName,
    findUserByCredentials,
    createUser
};
