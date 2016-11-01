// this module holds the functions for the routes that are associated with forum threads
let Thread = require('mongoose').model('Thread')

module.exports = {
  showCreate: (req, res) => {
    res.render('thread/register')
  },

  create: (req, res) => {
    // get the max ID and increment it on the new thread
    Thread
      .findOne()
      .sort('-id')
      .exec((err, item) => {
        if (err) {
          console.log(err)
        } else {
          let incrementedID = 1

          if (item) {
            incrementedID = item.id + 1
          }

          let thread = req.body

          thread.author = req.user.username
          thread.id = incrementedID
          Thread
            .create(thread)
            .then((thread) => {
              console.log('Created a new thread with title ' + thread.title)
              res.redirect('/')
            })
        }
      })
  }
}
