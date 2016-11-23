const mongoose = require('mongoose')

let threadSchema = mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  title: {
    type: String,
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
  },

  answers: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
    ref: 'Answer'
  }],

  views: { type: Number, default: 0 }
})

function removeThreadAnswers (thread, next) {
  // this function deletes all the answer in the given thread from the database, returning an array of promises for each answer deletion 
  const Answer = mongoose.model('Answer')
  return thread.answers.map((answerId) => {
    return new Promise((resolve, reject) => {
      Answer.findById(answerId).then((answer) => {
        if (!answer) {
          reject()
          return
        }
        answer.remove().then(() => {
          resolve()
        })
      })
    })
  })
}

// middleware to remove every dependant document on deletion
threadSchema.pre('remove', true, function (next, done) {
  let promises = removeThreadAnswers(this, next)


  Promise.all(promises).then(() => {
    done()
    next()
  })
})

threadSchema.method({
  // removes an answer from the thread, resolving a promise when ready
  removeAnswer: function (answerId, resolve, reject) {
    this.answers.remove(answerId)
    this.save().then(() => {
      resolve()
    })
  }
})

mongoose.model('Thread', threadSchema)

