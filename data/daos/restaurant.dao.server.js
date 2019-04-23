const restModel = require('../models/restaurant/restaurant.model.server');

createRestaurant = (newRest) =>
    restModel.createRestaurant(newRest).then(
        newRestaurant => newRestaurant
    );

getRestaurants = () =>
    restModel.getRests().then(
        rests => rests
    );

getRestaurantById = (restId) =>
    restModel.getRestaurantById(restId).then(
        rest => rest
    );

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById
};
