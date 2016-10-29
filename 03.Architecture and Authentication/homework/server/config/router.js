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


  // Edit article page
  app.get('/articles/edit/:articleTitle', auth.isAuthenticated, controllers.articles.editPage)
  app.post('/articles/edit/editArticle', auth.isAuthenticated, controllers.articles.editArticle)

  // Article details page
  app.get('/articles/details/:articleTitle', auth.isAuthenticated, controllers.articles.detailsPage)

  // Delete article request
  app.post('/articles/delete/:articleTitle', auth.isInRole('Admin'), controllers.articles.deleteArticle)

  // Add coment to an article
  app.post('/articles/details/:articleTitle/addArticleComment', auth.isAuthenticated, controllers.articles.addComment)

  
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
