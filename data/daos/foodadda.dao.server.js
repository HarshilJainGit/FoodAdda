const userModel = require('../models/user/user.model.server')

const mongoose = require('mongoose')

    findAllUsers = () =>
        userModel.find()

    createUser = user =>
        userModel.create(user)


module.exports = {
    findAllUsers,
    createUser
}
