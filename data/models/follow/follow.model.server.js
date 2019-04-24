const mongoose=require("mongoose");
const followSchema=require("./follow.schema.server");
const followModel = mongoose.model("FollowModel",followSchema);

//crud operations

getAllFollow = () => {
    return followModel.find()
        .populate('follower')
        .populate('following')
        .exec();
};

//create Follow
createFollow = (newFollow) => {
    return followModel.findOne({follower:newFollow.follower,following:newFollow.following})
        .then(function (response) {
            //console.log(response);
            if (response===null){
                followModel.create(newFollow);
            }
        });
};

//delete follows
deleteFollows = (followId) => {
    return followModel.remove({_id:followId});
};


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

// //delete following when user deletes profile
// function deleteFollowing(userId) {
//     return followModel.find({follower:userId})
//         .then(function (followlist) {
//             followModel.find({following:userId})
//                 .then(function (list) {
//                     Array.prototype.push.apply(followlist,list);
//                     for (let v of followlist){
//                         console.log('follower:'+followlist[v].follower + ':following: '+followlist[v].following);
//                         deleteFollow(followlist[v].follower,followlist[v].following);
//                         deleteFollow(followlist[v].following,followlist[v].follower);
//                     }
//                 });
//         });
// }

//delete following when user deletes profile
function deleteFollowing(userId) {
    return followModel.deleteMany({}).populate({
        path:'follower',match:{_id:userId}
    }).then(
        stats => {
            return followModel.deleteMany({}).populate({
                path:'following',match:{_id:userId}
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
