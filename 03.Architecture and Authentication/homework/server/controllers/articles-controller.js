let Article = require('mongoose').model('Article')

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}


module.exports = {
  // display the page letting the user add an article
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
              res.redirect('/articles')
            })
          }
      })
  },

  list: (req, res) => {
    // the page we're currently on and the query strings for the pagination
    let page = isNumeric(req.query.page) ? parseInt(req.query.page) : 0
    let nextPageQueryString = '?page=' + (page+1)
    let prevPageQueryString =  page !== 0 ? '?page=' + (page-1) : undefined
    let articlesPerPage = 5

    // show the page that lists all the articles
    Article
      .find({})
      .sort('-_id')  // to sort them in newest-oldest
      .skip(articlesPerPage * page)
      .limit(articlesPerPage)
      .then((articles) => {
        if (articles.length == 0) {
          // reset to the first page if we can't list anything on the requested page
          res.redirect('articles?page=0')
        } else {
          res.render('articles/list-articles', {
            articles: articles,
            prevPageQueryString: prevPageQueryString,
            nextPageQueryString: nextPageQueryString
          })
        }
      })
  }
}
