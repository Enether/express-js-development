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

// middleware to remove every dependant document on deletion
threadSchema.pre('remove', true, function (next, done) {
  const Answer = mongoose.model('Answer')
  let promises = []
  // fill promises with promises of answer deletions
  for (let answerId of this.answers) {
    promises.push(new Promise((resolve, reject) => {
      Answer.findById(answerId).then((answer) => {
        if (!answer) {
          reject()
          return
        }
        answer.remove().then(() => {
          resolve()
        })
      })
    }))
  }

  Promise.all(promises).then(() => {
    done()
    next()
  })
})

threadSchema.method({
  // removes an answer from the thread, returning a promise
  removeAnswer: function (answerId, resolve, reject) {
    console.log('THREAD ANSWERS')
    console.log(this.answers)
    this.answers.remove(answerId)
    this.save().then(() => {
      resolve()
    })
  }
})

mongoose.model('Thread', threadSchema)

