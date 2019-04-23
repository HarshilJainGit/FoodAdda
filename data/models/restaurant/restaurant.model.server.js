const mongoose = require('mongoose');
const restaurantSchema = require('./restaurant.schema.server');
const restModel = mongoose.model('RestaurantModel', restaurantSchema);

createRestaurant = (newRest) =>
    restModel.create(newRest);

getRests = () =>
    restModel.find();

getRestaurantById = (restId) =>
    restModel.findOne({id:restId});

module.exports = {
    createRestaurant,
    getRestaurantById,
    getRests
};
