// no need to have index in the path below, because JS by default searches for index.js
let controllers = require('../controllers')
let auth = require('./auth')
module.exports = (app) => {
  app.get('/', controllers.home.index)
  app.get('/users/create', controllers.users.register)
  app.post('/users/create', controllers.users.create)
  app.get('/users/login', controllers.users.login)
  app.post('/users/authenticate', controllers.users.authenticate)
  app.post('/users/logout', controllers.users.logout)

  app.get('/articles/add', (req, res) => {
    auth.isAuthenticated(req, res, controllers.articles.add)
  })

  app.all('*', controllers.home.about)
}
