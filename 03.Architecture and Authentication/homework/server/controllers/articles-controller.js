let Article = require('mongoose').model('Article')

module.exports = {
  // display the page letting the user add an artidle
  add: (req, res) => {
    res.render('articles/add-article')
  },

  // add the article to the DB
  create: (req, res) => {
    let article = req.body
    let author = {
      id: req.user._id,
      fullName: req.user.firstName + ' ' + req.user.lastName
    }
    article.author = author

    Article
      .find({'title': article.title})
      .then((articles) => {
        // make sure such an article does not exist        
        if (articles.length !== 0) {
          // such an article exists
          article.globalError = 'There already is an article with the title ' + article.title
          res.render('articles/add-article', article)
          return
        } else {
          // create the article
          Article
            .create(article)
            .then(() => {
              console.log('Saved article ' + article.title + ' successfully!')
              // TODO: Redirect to list of articles
            })
          }
      })
  }
}