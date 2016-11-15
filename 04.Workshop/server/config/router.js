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
  // user profile
  app.get('/profile/:username', auth.isAuthenticated, controllers.user.showProfile)

  // thread create page
  app.get('/thread/create', auth.isAuthenticated, controllers.thread.showCreate)
  app.post('/thread/create', auth.isAuthenticated, controllers.thread.create)

  // thread list page
  app.get('/thread/list', controllers.thread.showList)


  // show thread page
  app.get('/post/:id/:title', controllers.thread.showThread)
  // edit thread page
  app.get('/post/:id/:title/edit', auth.isAuthenticated, controllers.thread.showEditPage)
  app.post('/thread/:id/edit', controllers.thread.editThread)
  // delete thread request
  app.post('/post/:id/:title', auth.isAuthenticated, controllers.thread.deleteThread)

  // delete answer action
  app.post('/answer/:id/delete', auth.isAuthenticated, controllers.thread.deleteAnswer)
  // add answer action
  app.post('/answer/:id/:title', auth.isAuthenticated, controllers.thread.addAnswer)

  // get page with all the admins
  app.get('/admins/all', auth.isAuthenticated, controllers.admin.showAllAdminsPage)
  app.get('/admins/usersList', auth.isAuthenticated, controllers.admin.showAllUsersPage)

  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found :@')
    res.end()
  })
}
