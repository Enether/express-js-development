const mongoose = require('mongoose')
const autoIncrement = require('mongoose-sequence')

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
  }
})

function removeAnswerFromThread (answer, next) {
  // this function removes the answer from the thread's answers list, returning a Promise
  const Thread = mongoose.model('Thread')
  return new Promise(function (resolve, reject) {
    Thread.findById(answer.thread)
      .then((thread) => {
        if (!thread) {
          let err = new Error('The thread saved in the answer does not exist!')
          next(err)
        } else if (thread.answers.indexOf(answer._id) === -1) {  // check if the answer is in the thread's answers
          let err = new Error("The answer you're trying to delete is not in the thread's answers")
          next(err)
        }
        thread.removeAnswer(answer._id, resolve, reject) // resolve is in here
      })
  })
}
function removeAnswerFromAuthor (answer, next) {
  // this function removes this answer from the author's answers list, returning a Promise
  const User = mongoose.model('User')
  return new Promise((resolve, reject) => {
    User.findById(answer.author)
      .then((author) => {
        if (!author) {
          let err = new Error("The answer you're deleting does not have an author!")
          next(err)
        } else if (author.answers.indexOf(answer._id) === -1) {  // check if answer is in the user's answers
          let err = new Error("An answer we're deleting from the user's answers array is not there. :o")
          next(err)
        }

        author.removeAnswer(answer._id, resolve, reject)  // resolve is in here
      })
  })
}

answerSchema.pre('remove', true, function (next, done, req) {
  // remove the answer from the connected Models first
  let promises = [removeAnswerFromThread(this, next), removeAnswerFromAuthor(this, next)]

  Promise.all(promises).then(() => {
    next()
    done()
  })
})

answerSchema.plugin(autoIncrement, {inc_field: 'answerId'})
mongoose.model('Answer', answerSchema)
