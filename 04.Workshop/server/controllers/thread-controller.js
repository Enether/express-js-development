// this module holds the functions for the routes that are associated with forum threads
const mongoose = require('mongoose')
const User = mongoose.model('User')
const Thread = mongoose.model('Thread')
const Answer = mongoose.model('Answer')

function getPagesArray(pagesCount) {
  // get an array of all the pages we want to display in articles/list
  let pages = []
  for (let i = 1; i <= pagesCount; i++) {
    pages.push(i)
  }
  return pages
}

module.exports = {
  showCreate: (req, res) => {
    res.render('thread/register')
  },

  showList: (req, res) => {
    let page = parseInt(req.query.page || '1') - 1
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
        let pagesToSkip = 20 * page
        let pageThreads = threads.slice(pagesToSkip, Math.min(threads.length, (pagesToSkip) + 20))

        Thread.count({}, (err, threadsCount) => {
          if (err) {
            req.session.nonFatalError = err.message
            res.redirect('/')
            return
          }
          let pageCount = Math.ceil(threadsCount / 20)
          let pages = getPagesArray(pageCount)
          res.render('thread/list', { threads: pageThreads, pages: pages })
        })
      })
  },

  showEditPage: (req, res) => {
    let threadId = req.params.id

    Thread
      .findOne({ threadId: threadId })
      .then((thread) => {
        if (!thread) {
          // ERROR!
          req.session.nonFatalError = `No such thread with ID ${threadId} exists!`
          res.redirect('/')
          return
        } else if (!req.user.isAdmin()) {
          // unauthorized access
          req.session.nonFatalError = 'You do not have permission for that action!'
          res.redirect(`/post/${thread.threadId}/${thread.title}`)
          return
        }

        res.render('thread/edit', { thread: thread })
        return
      })
  },

  showThread: (req, res) => {
    let threadID = req.params.id === 'js' ? 0 : req.params.id
    let nonFatalError = ''
    if (req.session.nonFatalError) {
      nonFatalError = req.session.nonFatalError
      delete req.session.nonFatalError
    }
    Thread
      .findOne({ threadId: threadID })
      .populate(['answers', 'author'])
      .then((thread) => {
        if (!thread) {
          // ERROR
          req.session.nonFatalError = `No thread with ID: ${threadID} exists!`
          console.log('No thread found!')
          res.redirect('/')
          return
        }
        Thread.populate(thread, { path: 'answers.author', model: User }, (err, te) => {
          if (err) {
            console.log('ERROR IN POPULATING AUTHORS IN THREAD-CONTROLLER.JS')
          } else {
            // increment the thread's views
            thread.views += 1

            thread.save((err) => {
              if (err) {
                req.session.nonFatalError = err
                res.redirect('/')
                return
              }

              res.render('thread/thread', { thread: thread, answers: thread.answers, nonFatalError: nonFatalError })
            })
          }
        })
      })
  },

  editThread: (req, res) => {
    let threadId = req.params.id

    Thread
      .findOne({ threadId: threadId })
      .then((thread) => {
        if (!thread) {
          // ERROR
          req.session.nonFatalError = `No such thread with ID ${threadId} exists!`
          res.redirect('/')
          return
        } else if (!req.user.isAdmin()) {
          // unauthorized access!
          res.redirect('/')
          return
        }
        // update the thread
        thread.title = req.body.title
        thread.content = req.body.content

        thread.save().then(() => {
          res.redirect(`/post/${thread.threadId}/${thread.title}`)
        })
      })
  },

  create: (req, res) => {
    let thread = req.body
    thread.author = req.user._id

    Thread
      .create(thread)
      .then(thread => {
        // save to user
        User.findById(thread.author).then(user => {
          user.threads.push(thread._id)
          user.save()
        })

        res.redirect('/')
      })
  },

  addAnswer: (req, res) => {
    let threadId = req.params.id  // from the URL /answer/:id/:title
    let answer = req.body

    // validate the thread
    Thread
      .findOne({ threadId: threadId })
      .then((thread) => {
        if (!thread) {
          req.session.nonFatalError = `No thread with ID ${threadId} exists!`
          res.redirect('/')
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
                  console.log('No user when trying to add a answer, this shouldnt be happening! :O')
                  throw Error
                }

                user.answers.push(answer._id)  // save the answer to the user's answers too
                user.save()
                res.redirect('/post/' + threadId + '/' + req.params.title)
              })
          })
      })
  },

  deleteAnswer: (req, res) => {
    let answerId = req.params.id

    Answer
      .findOne({ answerId: answerId })
      .populate(['thread', 'author'])
      .then((answer) => {
        if (!answer) {
          // ERROR
          req.session.nonFatalError = `Could not delete answer with id ${answerId} simply because it doesnt exist!`
          res.redirect('/')
          return
        }
        answer.remove(req, function (err) {
          if (err) {
            req.session.nonFatalError = err.message
            res.redirect('/')
            return
          }
          res.redirect('/')
        })
      })
  },

  deleteThread: (req, res) => {
    let threadId = req.params.id

    Thread
      .findOne({ threadId: threadId })
      .then((thread) => {
        if (!thread) {
          // ERROR
          req.session.nonFatalError = `Unsuccessful delete request. Thread with id ${threadId} does not exist.`
          res.redirect('/')
          return
        } else if (!req.user.isAdmin()) {
          // Unauthorized deletion
          res.redirect('/')
          return
        }

        thread.remove().then(() => {
          res.redirect('/')
        })
      })
  }
}
