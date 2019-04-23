const mongoose=require("mongoose");
const followSchema=require("./follow.schema.server");
const followModel = mongoose.model("FollowModel",followSchema);

//
// followModel.createFollow=createFollow;
// followModel.deleteFollow=deleteFollow;
// followModel.findAllFollowing=findAllFollowing;
// followModel.findAllFollowers=findAllFollowers;
// followModel.deleteFollowing=deleteFollowing;
// followModel.getAllFollow=getAllFollow;
// followModel.deleteFollows=deleteFollows;
// module.exports = followModel;


//crud operations

function getAllFollow() {
    return followModel.find()
        .populate('follower')
        .populate('following')
        .exec();
}

//create Follow
function createFollow(newFollow) {
    return followModel.findOne({follower:newFollow.follower,following:newFollow.following})
        .then(function (response) {
            //console.log(response);
            if (response===null){
                followModel.create(newFollow);
            }
        });
}

//delete follows
function deleteFollows(followId) {
    return followModel.remove({_id:followId});
}


// delete a follow
function deleteFollow(follower,following) {

    return followModel.findOne({follower:follower, following:following})
        .then(function (follow) {
            console.log(follow);
            followModel.remove({_id:follow._id})
                .then(function (response) {
                    //console.log(response);
                });
        });
}

//find followers
function findAllFollowers(followerId) {
    //console.log(followerId);
    return followModel
        .find({following:followerId})
        .populate('follower')
        .populate('following')
        .exec();
}

//find following

function findAllFollowing(userId) {
    return followModel
        .find({follower:userId})
        .populate('follower')
        .populate('following')
        .exec();
}

//delete following when user deletes profile
function deleteFollowing(userId) {
    return followModel.find({follower:userId})
        .then(function (followlist) {
            followModel.find({following:userId})
                .then(function (list) {
                    Array.prototype.push.apply(followlist,list);
                    for (let v of followlist){
                        deleteFollow(followlist[v].follower,followlist[v].following);
                        deleteFollow(followlist[v].following,followlist[v].follower);
                    }
                });
        });
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
