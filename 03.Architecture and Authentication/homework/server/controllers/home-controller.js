// this module holds the functions for the routes in the homepage

module.exports = {
  index: (req, res) => {
    res.render('home/index')
  },
  about: (req, res) => {
    res.render('home/about')
  }
}
