// this module holds the functions for the routes in the homepage
let Thread = require('mongoose').model('Thread')
module.exports = {
  index: (req, res) => {
    Thread
      .find()
      .limit(20)
      .populate('author')
      .then((threads) => {
        res.render('home/index', {threads: threads})
      })
  }
}
