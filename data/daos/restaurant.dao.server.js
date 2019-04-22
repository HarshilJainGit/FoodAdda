const restModel = require('../models/restaurant/restaurant.model.server');

createRestaurant = (newRest) =>
    restModel.createRestaurant(newRest).then(
        newRestaurant => newRestaurant
    );

getRestaurants = () =>
    restModel.getRests().then(
        rests => rests
    );

module.exports = {
    createRestaurant,
    getRestaurants
};
