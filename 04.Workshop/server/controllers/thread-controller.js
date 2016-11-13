// this module holds the functions for the routes that are associated with forum threads
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')

module.exports = {
  showCreate: (req, res) => {
    res.render('thread/register')
  },

  showList: (req, res) => {
    // 20 threads sorted by their last answer's date
    Thread
      .find()
      .populate(['answers', 'author'])
      .then((threads) => {
        // order by the latest answer in the thread
        threads.sort((x, y) => {
          if (x.answers.length === 0 || y.answers.length === 0) {
            // if one of them does not have any answers, list the one with answers in front
            return x.answers.length < y.answers.length
          }
          return x.answers[x.answers.length - 1].creationDate < y.answers[y.answers.length - 1].creationDate
        })
        // take the first 20
        let orderedThreads = threads.slice(0, Math.min(threads.length, 20))

        res.render('thread/list', { threads: orderedThreads })
      })
  },

  showThread: (req, res) => {
    let threadID = req.params.id === 'js' ? 0 : req.params.id
    Thread
      .findOne({ 'id': threadID })
      .populate('answers')
      .then((thread) => {
        if (!thread) {
          // ERROR
          console.log('No thread found!')
          return
        }
        Thread.populate(thread, { path: 'answers.author', model: User }, (err, te) => {
          if (err) {
            console.log('ERROR IN POPULATING AUTHORS IN THREAD-CONTROLLER.JS')
          } else {
            res.render('thread/thread', { thread: thread, answers: thread.answers })
          }
        })
      })
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
            incrementedID = parseInt(item.id) + 1
          }

          let thread = req.body

          thread.author = req.user._id
          thread.id = incrementedID
          Thread
            .create(thread)
            .then((thread) => {
              console.log('Created a new thread with title ' + thread.title)
              res.redirect('/')
            })
        }
      })
  },

  addComment: (req, res) => {
    let threadId = req.params.id  // from the URL /comment/:id/:title
    let answer = req.body

    if (!req.isAuthenticated()) {
      console.log('User must be authenticated!!!')
      return
    }
    // validate the thread
    Thread
      .findOne({ id: threadId })
      .then((thread) => {
        if (!thread) {
          console.log('No thread with ID ' + threadId + ' exists!')
          return
        }

        answer.thread = thread._id
        answer.author = req.user._id  // attach the user to the article
        answer.creationDate = new Date()

        Answer
          .create(answer)  // save the answer to the db
          .then((answer) => {
            console.log(thread.answers)
            thread.answers.push(answer._id)  // save it to the thread's answers too
            console.log(thread.answers)
            thread.save()
            User
              .findById(answer.author)
              .then((user) => {
                if (!user) {
                  console.log('No user when trying to add a comment, this shouldnt be happening! :O')
                  throw Error
                }

                user.answers.push(answer._id)  // save the answer to the user's answers too
                user.save()
                res.redirect('/post/' + threadId + '/' + req.params.title)
              })
          })
      })
  },

  deleteThread: (req, res) => {
    let threadId = req.params.id

    Thread
      .findOne({id: threadId})
      .then((thread) => {
        if (!thread) {
          // ERROR
          console.log('Unsuccessful delete request. Thread with id ' + threadId + ' does not exist.')
          return
        }

        thread.remove()
        res.redirect('/')
      })
  }
}
