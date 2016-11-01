// this module holds the functions for the routes that are associated with forum threads
let Thread = require('mongoose').model('Thread')

module.exports = {
  showCreate: (req, res) => {
    res.render('thread/register')
  },

  create: (req, res) => {
    let thread = req.body

    thread.author = req.user.username

    Thread
      .create(thread)
      .then((thread) => {
        console.log('Created a new thread with title ' + thread.title)
        res.redirect('/')
      })
  }
}
