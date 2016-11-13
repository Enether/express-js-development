const controllers = require('../controllers/index')
const auth = require('../config/auth')

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

  // thread create page
  app.get('/thread/create', auth.isAuthenticated, controllers.thread.showCreate)
  app.post('/thread/create', auth.isAuthenticated, controllers.thread.create)

  // thread list pageg
  app.get('/thread/list', controllers.thread.showList)

  // show thread page
  app.get('/post/:id/:title', controllers.thread.showThread)
  // add comment action
  app.post('/comment/:id/:title', auth.isAuthenticated, controllers.thread.addComment)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found :@')
    res.end()
  })
}
