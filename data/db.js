module.exports = function () {
    const mongoose = require('mongoose');
    const databaseName = 'white-board';
    let herokuString = 'mongodb://heroku_3129sqxm:8kl6hhgohdvrjkv5441dof7m9t@ds225078.mlab.com:25078/heroku_3129sqxm';
    let connectionString =
        'mongodb://localhost/';
    connectionString += databaseName;
    mongoose.connect(herokuString, { useNewUrlParser: true }).then(
        () => console.log('Connected')
    ).catch(
        () => console.log('Unable to connect')
    );
};
