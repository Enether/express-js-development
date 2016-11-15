// this module holds the functions for the routes in the homepage
let Thread = require('mongoose').model('Thread')
module.exports = {
  index: (req, res) => {
    let nonFatalError = ''
    if (req.session.nonFatalError) {
      nonFatalError = req.session.nonFatalError
      delete req.session.nonFatalError
    }
    Thread
      .find()
      .limit(20)
      .populate('author')
      .then((threads) => {
        res.render('home/index', {threads: threads, nonFatalError: nonFatalError})
      })
  }
}
