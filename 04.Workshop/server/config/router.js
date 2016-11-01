const controllers = require('../controllers/index')

module.exports = (app) => {
  // home page route
  app.get('/', controllers.home.index)

  // user register page
  app.get('/register', controllers.user.showRegister)
  // register action
  app.post('/register', controllers.user.register)

  // user login page
  app.get('/login', controllers.user.showLogin)
  // login action
  app.post('/login', controllers.user.login)
  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found :@')
    res.end()
  })
}
