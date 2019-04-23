const mongoose = require('mongoose');
const reviewSchema = require('./review.schema.server');
const reviewModel = mongoose.model('ReviewModel', reviewSchema);

createReview = (newReview) =>
    reviewModel.create(newReview);

getReviews = (restId) =>
    reviewModel.find({
        restaurantId:restId
    });

module.exports = {
    createReview,
    getReviews,

};
