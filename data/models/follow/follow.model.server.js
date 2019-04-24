const mongoose = require("mongoose");
const followSchema = require("./follow.schema.server");
const followModel = mongoose.model("FollowModel", followSchema);

//Get all follows
getAllFollow = () => {
    return followModel.find()
        .populate('follower')
        .populate('following')
        .exec();
};

//create follow
createFollow = (newFollow) => {
    return followModel.findOne({
        follower: newFollow.follower,
        following: newFollow.following
    }).then(function (response) {
        if (response === null) {
            followModel.create(newFollow);
        }
    });
};

//delete follows by follow id
deleteFollows = (followId) => {
    return followModel.remove({
        _id: followId
    });
};


// delete a follow by follower and following id
deleteFollow = (follower, following) => {
    return followModel.findOne({
        follower: follower,
        following: following
    }).then(function (follow) {
        followModel.remove({_id: follow._id})
            .then(function (response) {
                //console.log(response);
            });
    });
};

//find followers of users
findAllFollowers = (followerId) => {
    //console.log(followerId);
    return followModel
        .find({following: followerId})
        .populate('follower')
        .populate('following')
        .exec();
};

//find following users
findAllFollowing = (userId) => {
    return followModel
        .find({follower: userId})
        .populate('follower')
        .populate('following')
        .exec();
};

//delete follows when admin deletes user profile
function deleteFollowing(userId) {
    return followModel.deleteMany({}).populate({
        path: 'follower', match: {_id: userId}
    }).then(
        stats => {
            return followModel.deleteMany({}).populate({
                path: 'following', match: {_id: userId}
            })
        }
    )
}

module.exports = {
    createFollow,
    deleteFollow,
    findAllFollowing,
    findAllFollowers,
    deleteFollowing,
    getAllFollow,
    deleteFollows
};
