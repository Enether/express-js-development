const controllers = require('../controllers/index')
const auth = require('../config/auth')

module.exports = (app) => {
  // home page route
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)

  // register page
  app.get('/registerUser', controllers.users.register)

  // post to register a user
  app.post('/registerUser', controllers.users.create)

  app.get('/login', controllers.users.login)
  app.post('/login', controllers.users.authenticate)

  app.post('/logout', controllers.users.logout)

  // Creating an article
  app.get('/articles/add', auth.isAuthenticated, controllers.articles.add)
  app.post('/articles/addArticle', auth.isAuthenticated, controllers.articles.create)

  // List of articles
  app.get('/articles', controllers.articles.list)

  /*
  app.all('/:controller/:method/:id', (req, res) => {
    controllers[req.params.controller].req.params.method(id)
  })
  sample routing when routes become too much
  id must not be optional
  to be frank, not too sure what the ID stands for in this case
  */
  app.all('*', (req, res) => {
    res.status(404)
    res.send('404 Not Found :@')
    res.end()
  })
}
