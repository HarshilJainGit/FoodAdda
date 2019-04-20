const mongoose = require('mongoose');
const restaurantSchema = require('./restaurant.schema.server');
const restModel = mongoose.model('RestaurantModel', restaurantSchema);

createRestaurant = (newRest) =>
    restModel.create(newRest);

module.exports = {
    createRestaurant
};
