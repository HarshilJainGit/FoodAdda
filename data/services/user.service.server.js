const userDao = require('../daos/foodadda.dao.server')

module.exports = app => {

    createUser = (req, res) => {
        console.log(req.body);
        userDao
            .createUser(req.body)
        res.send(req.body)
    }

    getUsers = (req,res) => {
        userDao.findAllUsers()
    }

    app.post('/api/register', createUser)
    app.get('/api/user',getUsers)

}
