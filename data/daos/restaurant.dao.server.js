const restModel = require('../models/restaurant/restaurant.model.server');

createRestaurant = (newRest) =>
    restModel.createRestaurant(newRest).then(
        newRestaurant => newRestaurant
    );

module.exports = {
    createRestaurant
};
