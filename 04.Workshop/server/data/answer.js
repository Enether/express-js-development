const mongoose = require('mongoose')

let answerSchema = mongoose.Schema({
  thread: {
    type: mongoose.Schema.Types.ObjectId, // to article
    required: true,
    ref: 'Thread'
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,  // to user
    required: true,
    ref: 'User'
  },

  creationDate: {
    type: Date,
    required: true
  },

  content: {
    type: String,
    required: true
  },

  id: {
    type: Number,
    required: true,
    unique: true
  }
})

answerSchema.pre('remove', true, function (next, done, req) {
  const Thread = mongoose.model('Thread')
  const User = mongoose.model('User')
  // remove from the thread's answers
  let promises = [new Promise((resolve, reject) => {
    Thread.findById(this.thread)
    .then((thread) => {
      if (!thread) {
        let err = new Error('The thread saved in the answer does not exist!')
        next(err)
      } else if (thread.answers.indexOf(this._id) === -1) {  // check if the answer is in the thread's answers
        let err = new Error("The answer you're trying to delete is not in the thread's answers")
        next(err)
      }
      thread.removeAnswer(this._id, resolve, reject) // resolve is in here
    })
  })]
  // remove from the user's answers
  promises.push(new Promise((resolve, reject) => {
    User.findById(this.author)
      .then((author) => {
        if (!author) {
          let err = new Error("The answer you're deleting does not have an author!")
          next(err)
        } else if (author.answers.indexOf(this._id) === -1) {  // check if answer is in the user's answers
          let err = new Error("An answer we're deleting from the user's answers array is not there. :o")
          next(err)
        }

        author.removeAnswer(this._id, resolve, reject)  // resolve is in here
      })
  }))

  Promise.all(promises).then(() => {
    next()
    done()
  })
})

mongoose.model('Answer', answerSchema)
