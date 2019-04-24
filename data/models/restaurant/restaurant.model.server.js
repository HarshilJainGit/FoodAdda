const mongoose = require('mongoose');
const restaurantSchema = require('./restaurant.schema.server');
const restModel = mongoose.model('RestaurantModel', restaurantSchema);

//Create restaurant
createRestaurant = (newRest) =>
    restModel.create(newRest);

getRests = () =>
    restModel.find();

getRestaurantById = (restId) =>
    restModel.findOne({id: restId});

getRecentRests = () =>
    restModel.find().sort({id: -1});

updateRest = (restId, newRest) =>
    restModel.update({id: restId}
        , {$set: newRest}
    );

deleteRest = (restId) =>
    restModel.deleteOne({id: restId});

module.exports = {
    createRestaurant,
    getRestaurantById,
    getRests,
    getRecentRests,
    updateRest,
    deleteRest
};
