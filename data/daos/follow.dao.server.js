// const app=require('express');
// const followModel=require("../models/follow/follow.model.server");
//
// app.get    ("/api/Follower/:userId",getFollowers);
// app.put    ("/api/createFollow/:follower/:following",follow);
// app.delete ("/api/unfollow/:follower/:following",unfollow);
// app.get    ("/api/getFollowing/:userId",getFollowing);
// app.get    ("/api/getallfollow",getAllFollow);
// app.delete ("/api/deletefollow/:followId",deleteFollow);
//
// //follow
//
// function getFollowers(req,res) {
//     const userId=req.params.userId;
//     followModel.findAllFollowers(userId)
//         .then(function (response) {
//             //console.log("________server____getFollowers");
//             //console.log(response);
//             res.json(response);
//         });
// }
//
// function getAllFollow(req,res) {
//     followModel.getAllFollow()
//         .then(function (response) {
//             //console.log(response);
//             res.json(response);
//         });
// }
//
// //add to followers when someone follows a user
// function follow(req,res) {
//     const follower=req.params.follower;
//     const following=req.params.following;
//     const newFollow= new Object();
//     newFollow.follower=follower;
//     newFollow.following=following;
//     //console.log(newFollow);
//     followModel.createFollow(newFollow)
//         .then(function (response) {
//                 res.sendStatus(200)
//             },
//             function (err) {
//                 res.sendStatus(404);
//             });
// }
//
// //delete follow
// function deleteFollow(req,res) {
//     const followId=req.params.followId;
//     followModel.deleteFollows(followId)
//         .then(function (response) {
//                 res.sendStatus(200);
//             },
//             function (err) {
//                 res.sendStatus(404);
//             });
// }
//
// //remove user from following
// function unfollow(req,res) {
//     const follower=req.params.follower;
//     const following=req.params.following;
//     //console.log(follower);
//     //console.log(following);
//     followModel.deleteFollow(following,follower)
//         .then(function (response) {
//                 //console.log(response);
//                 res.sendStatus(200);
//             },
//             function (err) {
//                 res.sendStatus(404);
//             });
// }
//
// //get all following give
// function getFollowing(req,res) {
//     const userId=req.params.userId;
//     followModel.findAllFollowing(userId)
//         .then(function (response) {
//             res.json(response);
//         });
// }
