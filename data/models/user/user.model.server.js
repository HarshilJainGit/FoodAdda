const mongoose = require('mongoose');
const userSchema = require('./user.schema.server');
const userModel = mongoose.model('UserModel', userSchema);
const followModel=require("../follow/follow.model.server");

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

createRestList = (userId,restId) =>
    userModel.update(
        {_id: userId}
        ,{$push: {createdRest:restId}
        }
    );

getUserFavs = (userId) =>
    userModel.findOne(
        {_id: userId}, {favRest: 1, _id: 0}
    );

getUserCreatedRest = (userId) =>
    userModel.findOne(
        {_id:userId},{createdRest:1, _id:0}
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

// add to followers
addToFollowers = (userId,followerId) => {
    return userModel.findById(userId)
        .then(function (user) {
            user.followers.push(followerId);
            return user.save();
        });
};

// add to following
addToFollowing = (userId,followingId) => {
    return userModel.findById(userId)
        .then(function (user) {
            user.following.push(followingId);
            return user.save();
        })
};

//remove follower
removeFollower = (userId,followerId) => {
    return userModel.findById(userId)
        .then(function (user) {
            var index= user.followers.indexOf(followerId);
            user.followers.splice(index,1);
            return user.save();
        })
};

removeFollowing = (userId,followingId) => {
    return userModel.findById(userId)
        .then(function (user) {
            var index=user.following.indexOf(followingId);
            user.following.splice(index,1);
            return user.save();
        });
};

// add to followers
addToFollowers = (userId,followerId) => {
    return userModel.findById(userId)
        .then(function (user) {
            user.followers.push(followerId);
            return user.save();
        });
};

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
    deleteFromFavourites,
    createRestList,
    getUserCreatedRest,
    addToFollowers,
    removeFollowing,
    removeFollower,
    addToFollowing
};
