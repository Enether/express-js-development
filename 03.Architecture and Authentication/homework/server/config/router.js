const controllers = require('../controllers/index')
const auth = require('../config/auth')

module.exports = (app) => {
  // home page route
  app.get('/', controllers.home.index)
  app.get('/about', controllers.home.about)
  // login/register user
  app.get('/registerUser', controllers.users.register)  // display register user page
  app.post('/registerUser', controllers.users.create)  // register user post request
  app.get('/login', controllers.users.login)  // display login page
  app.post('/login', controllers.users.authenticate)  // log in post request
  app.post('/logout', controllers.users.logout)  // logout post request
  // articles
  app.get('/articles/add', auth.isAuthenticated, controllers.articles.add)  // display add article page
  app.post('/articles/addArticle', auth.isAuthenticated, controllers.articles.create)  // add article post request
  app.get('/articles', controllers.articles.list)  // display list of articles
  app.get('/articles/edit/:articleTitle', auth.isAuthenticated, controllers.articles.editPage)  // display edit article page
  app.post('/articles/edit/editArticle', auth.isAuthenticated, controllers.articles.editArticle)  // edit article post request
  app.get('/articles/details/:articleTitle', auth.isAuthenticated, controllers.articles.detailsPage)  // display article details page
  app.post('/articles/delete/:articleTitle', auth.isInRole('Admin'), controllers.articles.deleteArticle)  // delete article post request
  app.post('/articles/details/:articleTitle/addArticleComment', auth.isAuthenticated, controllers.articles.addComment)  // add comment post request


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
