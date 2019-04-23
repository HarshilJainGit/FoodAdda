var mongoose=require('mongoose');
var followSchema=mongoose.Schema({
    follower:{type:mongoose.Schema.Types.String,ref:"UserModel"},
    following:{type:mongoose.Schema.Types.String,ref:"UserModel"}
},{collection:'follow'});

module.exports=followSchema;
